import unittest
from pathlib import Path
from shutil import which

from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]


class SiteSmokeTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.pw = sync_playwright().start()
        executable_path = which("chromium") or which("chromium-browser") or which("google-chrome")
        if not executable_path:
            executable_path = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
        cls.browser = cls.pw.chromium.launch(
            headless=True,
            executable_path=executable_path,
            args=["--no-sandbox", "--allow-file-access-from-files"],
        )

    @classmethod
    def tearDownClass(cls):
        cls.browser.close()
        cls.pw.stop()

    def page(self, width=390, height=844):
        page = self.browser.new_page(viewport={"width": width, "height": height})
        html = (ROOT / "index.html").read_text(encoding="utf-8")
        html = html.replace('<link rel="stylesheet" href="styles.css">', '')
        html = html.replace('<script src="src/data/conference.js" defer></script>', '')
        html = html.replace('<script src="app.js" defer></script>', '')
        page.set_content(html, wait_until="load")
        page.add_style_tag(content=(ROOT / "styles.css").read_text(encoding="utf-8"))
        page.add_script_tag(content=(ROOT / "src/data/conference.js").read_text(encoding="utf-8"))
        page.add_script_tag(content=(ROOT / "app.js").read_text(encoding="utf-8"))
        return page

    def test_share_deck_combines_the_requested_chair_categories(self):
        page = self.page()
        deck = page.locator("main.share-deck")
        self.assertEqual(
            deck.locator(":scope > .share-slide").evaluate_all("slides => slides.map(slide => slide.id)"),
            [
                "top", "about", "dates", "tracks", "chairs-general-program", "chairs-vice-workshop",
                "chairs-steering", "submission", "support",
            ],
        )
        self.assertEqual(deck.evaluate("deck => getComputedStyle(deck).scrollSnapType"), "y mandatory")
        self.assertEqual(page.locator(".share-progress [data-slide-target]").count(), 9)
        page.close()

    def test_document_uses_the_provided_site_icon(self):
        page = self.page()
        favicon = page.locator('link[rel="icon"]')
        touch_icon = page.locator('link[rel="apple-touch-icon"]')
        self.assertEqual(favicon.count(), 1)
        self.assertEqual(touch_icon.count(), 1)
        self.assertEqual(favicon.get_attribute("href"), "assets/icon.png")
        self.assertEqual(touch_icon.get_attribute("href"), "assets/icon.png")
        page.close()

    def test_hero_description_uses_a_high_contrast_color(self):
        page = self.page()
        description = page.locator(".share-hero-name")
        self.assertEqual(description.evaluate("node => getComputedStyle(node).color"), "rgba(255, 255, 255, 0.92)")
        page.close()

    def test_hero_image_has_a_supporting_dark_overlay(self):
        page = self.page()
        overlay = page.locator(".share-city").evaluate(
            "node => getComputedStyle(node, '::after').backgroundImage"
        )
        self.assertIn("rgb(2, 10, 24)", overlay)
        self.assertIn("rgb(3, 11, 26)", overlay)
        page.close()

    def test_progress_navigation_activates_the_selected_module(self):
        page = self.page()
        page.get_by_role("button", name="Go to General & Program Chairs").click()
        self.assertEqual(page.locator("main.share-deck").get_attribute("data-active-slide"), "chairs-general-program")
        page.close()

    def test_background_music_control_uses_the_global_music_source(self):
        page = self.page()
        controls = page.locator("[data-audio-toggle]")
        self.assertEqual(controls.count(), 1)
        self.assertEqual(page.locator("#top [data-audio-toggle]").count(), 0)
        audio = page.locator("audio[data-background-music]")
        self.assertEqual(audio.count(), 1)
        self.assertEqual(audio.get_attribute("src"), "assets/music.mp3")
        self.assertIsNotNone(audio.get_attribute("loop"))
        page.close()

    def test_share_deck_keeps_all_chair_portraits(self):
        page = self.page()
        chair_slides = page.locator(".share-chair-slide")
        self.assertEqual(chair_slides.count(), 3)
        self.assertEqual(chair_slides.locator(".share-chair-card").count(), 12)
        self.assertEqual(chair_slides.locator("img").count(), 12)
        general_program = page.locator("#chairs-general-program")
        self.assertTrue(general_program.get_by_text("General Chairs", exact=True).is_visible())
        self.assertTrue(general_program.get_by_text("Program Chairs", exact=True).is_visible())
        self.assertTrue(page.locator("#chairs-vice-workshop").get_by_text("Program Vice-Chairs", exact=True).is_visible())
        self.assertTrue(page.locator("#chairs-steering").get_by_text("Laurence T. Yang", exact=True).is_visible())
        self.assertTrue(page.locator("#chairs-vice-workshop").get_by_text("Zhou Zhou", exact=True).is_visible())
        page.close()

    def test_mobile_chair_cards_use_consistent_left_photo_layout(self):
        page = self.page()
        layouts = page.locator(".share-chair-slide .share-chair-card").evaluate_all(
            """cards => cards.map(card => {
                const photo = card.querySelector('img').getBoundingClientRect();
                const name = card.querySelector('h3').getBoundingClientRect();
                const institution = card.querySelector('p').getBoundingClientRect();
                return {
                    photoWidth: Math.round(photo.width),
                    photoHeight: Math.round(photo.height),
                    photoLeft: Math.round(photo.left),
                    nameLeft: Math.round(name.left),
                    institutionLeft: Math.round(institution.left),
                };
            })"""
        )
        self.assertEqual({item["photoWidth"] for item in layouts}, {84})
        self.assertEqual({item["photoHeight"] for item in layouts}, {104})
        self.assertTrue(all(item["photoLeft"] < item["nameLeft"] for item in layouts))
        self.assertTrue(all(item["nameLeft"] == item["institutionLeft"] for item in layouts))
        page.close()

    def test_mobile_chair_places_use_a_compact_single_line_layout(self):
        page = self.page()
        details = page.locator(".share-chair-slide .share-chair-card p").evaluate_all(
            "details => details.map(detail => ({ whiteSpace: getComputedStyle(detail).whiteSpace, overflow: getComputedStyle(detail).overflow }))"
        )
        self.assertTrue(all(item["whiteSpace"] == "nowrap" and item["overflow"] == "hidden" for item in details))
        page.close()

    def test_wide_desktop_chair_layout_uses_the_available_width(self):
        page = self.page(width=1280, height=800)
        general_program = page.locator("#chairs-general-program")
        groups_width = round(general_program.locator(".share-chair-groups").bounding_box()["width"])
        portrait_widths = general_program.locator(".share-chair-photo").evaluate_all(
            "photos => photos.map(photo => Math.round(photo.getBoundingClientRect().width))"
        )
        self.assertGreaterEqual(groups_width, 1000)
        self.assertEqual(set(portrait_widths), {150})
        page.close()

    def test_wide_desktop_keeps_three_program_vice_chairs_on_one_row(self):
        page = self.page(width=1280, height=800)
        top_positions = page.locator("#chairs-vice-workshop .share-chair-category:first-child .share-chair-photo").evaluate_all(
            "photos => photos.map(photo => Math.round(photo.getBoundingClientRect().top))"
        )
        self.assertEqual(len(set(top_positions)), 1)
        page.close()

    def test_wide_desktop_uses_one_portrait_size_across_chair_pages(self):
        page = self.page(width=1280, height=800)
        portrait_widths = page.locator(".share-chair-slide .share-chair-photo").evaluate_all(
            "photos => photos.map(photo => Math.round(photo.getBoundingClientRect().width))"
        )
        self.assertEqual(set(portrait_widths), {150})
        page.close()

    def test_wide_desktop_stacks_complete_chair_categories(self):
        page = self.page(width=1280, height=800)
        categories = page.locator("#chairs-general-program .share-chair-category").evaluate_all(
            "categories => categories.map(category => { const box = category.getBoundingClientRect(); return { left: Math.round(box.left), top: Math.round(box.top), width: Math.round(box.width) }; })"
        )
        self.assertEqual(categories[0]["left"], categories[1]["left"])
        self.assertLess(categories[0]["top"], categories[1]["top"])
        self.assertEqual({category["width"] for category in categories}, {880})
        page.close()

    def test_wide_desktop_chair_portraits_flow_from_the_left(self):
        page = self.page(width=1280, height=800)
        grid = page.locator("#chairs-vice-workshop .share-chair-category:nth-child(2) .share-chair-grid")
        positions = grid.locator(".share-chair-photo").evaluate_all(
            "photos => photos.map(photo => Math.round(photo.getBoundingClientRect().left))"
        )
        self.assertEqual(grid.evaluate("grid => getComputedStyle(grid).justifyContent"), "start")
        self.assertGreaterEqual(positions[1] - positions[0], 170)
        self.assertLessEqual(positions[1] - positions[0], 180)
        page.close()

    def test_wide_desktop_stacks_category_portrait_rows(self):
        page = self.page(width=1280, height=800)
        first_portrait_tops = page.locator("#chairs-vice-workshop .share-chair-category").evaluate_all(
            "categories => categories.map(category => Math.round(category.querySelector('.share-chair-photo').getBoundingClientRect().top))"
        )
        self.assertLess(first_portrait_tops[0], first_portrait_tops[1])
        page.close()

    def test_share_deck_exposes_submission_and_official_actions(self):
        page = self.page()
        self.assertEqual(
            page.locator("#submission").get_by_role("link", name="Submit via EDAS").get_attribute("href"),
            "https://edas.info/N35627",
        )
        self.assertEqual(
            page.locator("#support").get_by_role("link", name="Official website").get_attribute("href"),
            "https://ieee-ai-for-science.org/2026/ispa/",
        )
        page.close()

    def test_final_actions_swap_order_and_color_treatments(self):
        page = self.page()
        actions = page.locator("#support .share-actions a").evaluate_all(
            "links => links.map(link => ({ label: link.textContent.trim(), className: link.className }))"
        )
        self.assertEqual(actions, [
            {"label": "Official website →", "className": "share-action share-action--light"},
            {"label": "Submit via EDAS →", "className": "share-action share-action--outline"},
        ])
        page.close()

    def test_share_deck_keeps_supporting_organization_logos(self):
        page = self.page()
        support = page.locator("#support")
        self.assertEqual(support.locator("img").count(), 8)
        self.assertTrue(support.get_by_alt_text("IEEE logo").is_visible())
        self.assertTrue(support.get_by_alt_text("Zhengzhou University logo").is_visible())
        page.close()

    def test_mobile_support_logos_use_white_cards_and_equal_heights(self):
        page = self.page()
        support = page.locator("#support")
        logo_heights = support.locator(".share-logo-wrap img").evaluate_all(
            "logos => logos.map(logo => Math.round(logo.getBoundingClientRect().height))"
        )
        card_backgrounds = support.locator(".share-logo-wrap > div").evaluate_all(
            "cards => cards.map(card => getComputedStyle(card).backgroundColor)"
        )
        self.assertEqual(set(logo_heights), {36})
        self.assertEqual(set(card_backgrounds), {"rgb(255, 255, 255)"})
        page.close()


if __name__ == "__main__":
    unittest.main()
