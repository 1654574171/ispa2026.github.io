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

    def test_share_deck_has_full_page_modules_for_each_chair_category(self):
        page = self.page()
        deck = page.locator("main.share-deck")
        self.assertEqual(
            deck.locator(":scope > .share-slide").evaluate_all("slides => slides.map(slide => slide.id)"),
            [
                "top", "about", "dates", "tracks",
                "chairs-general", "chairs-program", "chairs-program-vice", "chairs-local",
                "chairs-workshop", "chairs-publicity", "chairs-publication", "chairs-web", "chairs-steering",
                "submission", "support",
            ],
        )
        self.assertEqual(deck.evaluate("deck => getComputedStyle(deck).scrollSnapType"), "y mandatory")
        self.assertEqual(page.locator(".share-progress [data-slide-target]").count(), 15)
        page.close()

    def test_progress_navigation_activates_the_selected_module(self):
        page = self.page()
        page.get_by_role("button", name="Go to Program Chairs").click()
        self.assertEqual(page.locator("main.share-deck").get_attribute("data-active-slide"), "chairs-program")
        page.close()

    def test_share_deck_keeps_all_chair_portraits(self):
        page = self.page()
        chair_slides = page.locator(".share-chair-slide")
        self.assertEqual(chair_slides.count(), 9)
        self.assertEqual(chair_slides.locator(".share-chair-card").count(), 20)
        self.assertEqual(chair_slides.locator("img").count(), 20)
        self.assertTrue(page.locator("#chairs-program").get_by_text("Program Chairs", exact=True).is_visible())
        self.assertTrue(page.locator("#chairs-steering").get_by_text("Laurence T. Yang", exact=True).is_visible())
        self.assertTrue(page.locator("#chairs-workshop").get_by_text("Zhou Zhou", exact=True).is_visible())
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


if __name__ == "__main__":
    unittest.main()
