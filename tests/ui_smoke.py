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
                "top", "about", "dates", "tracks", "chairs-general-program", "chairs-vice-local",
                "chairs-workshop-publicity", "chairs-publication-web", "chairs-steering", "submission", "support",
            ],
        )
        self.assertEqual(deck.evaluate("deck => getComputedStyle(deck).scrollSnapType"), "y mandatory")
        self.assertEqual(page.locator(".share-progress [data-slide-target]").count(), 11)
        page.close()

    def test_progress_navigation_activates_the_selected_module(self):
        page = self.page()
        page.get_by_role("button", name="Go to General & Program Chairs").click()
        self.assertEqual(page.locator("main.share-deck").get_attribute("data-active-slide"), "chairs-general-program")
        page.close()

    def test_background_music_control_toggles_its_state(self):
        page = self.page()
        controls = page.locator("[data-audio-toggle]")
        self.assertEqual(controls.count(), 1)
        control = controls.first
        self.assertEqual(control.get_attribute("aria-pressed"), "false")
        control.click()
        self.assertEqual(control.get_attribute("aria-pressed"), "true")
        self.assertEqual(control.get_attribute("aria-label"), "Mute background music")
        control.click()
        self.assertEqual(control.get_attribute("aria-pressed"), "false")
        page.close()

    def test_share_deck_keeps_all_chair_portraits(self):
        page = self.page()
        chair_slides = page.locator(".share-chair-slide")
        self.assertEqual(chair_slides.count(), 5)
        self.assertEqual(chair_slides.locator(".share-chair-card").count(), 20)
        self.assertEqual(chair_slides.locator("img").count(), 20)
        general_program = page.locator("#chairs-general-program")
        self.assertTrue(general_program.get_by_text("General Chairs", exact=True).is_visible())
        self.assertTrue(general_program.get_by_text("Program Chairs", exact=True).is_visible())
        self.assertTrue(page.locator("#chairs-vice-local").get_by_text("Local Chairs", exact=True).is_visible())
        self.assertTrue(page.locator("#chairs-steering").get_by_text("Laurence T. Yang", exact=True).is_visible())
        self.assertTrue(page.locator("#chairs-workshop-publicity").get_by_text("Zhou Zhou", exact=True).is_visible())
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

    def test_mobile_chair_institutions_are_not_clipped(self):
        page = self.page()
        details = page.locator(".share-chair-slide .share-chair-card p").evaluate_all(
            "details => details.map(detail => ({ scrollWidth: detail.scrollWidth, clientWidth: detail.clientWidth }))"
        )
        self.assertTrue(all(item["scrollWidth"] <= item["clientWidth"] for item in details))
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
