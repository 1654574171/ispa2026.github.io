import unittest
from shutil import which
from pathlib import Path

from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]


class SiteSmokeTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.pw = sync_playwright().start()
        executable_path = which("chromium") or which("chromium-browser") or which("google-chrome")
        if not executable_path:
            executable_path = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
        cls.browser = cls.pw.chromium.launch(headless=True, executable_path=executable_path, args=["--no-sandbox", "--allow-file-access-from-files"])

    @classmethod
    def tearDownClass(cls):
        cls.browser.close()
        cls.pw.stop()

    def page(self, width=390, height=844):
        page = self.browser.new_page(viewport={"width": width, "height": height})
        html = (ROOT / "index.html").read_text(encoding="utf-8")
        html = html.replace('<link rel="stylesheet" href="styles.css">', '')
        html = html.replace('<script src="src/data/conference.js"></script>', '')
        html = html.replace('<script src="app.js"></script>', '')
        page.set_content(html, wait_until="load")
        page.add_style_tag(content=(ROOT / "styles.css").read_text(encoding="utf-8"))
        page.add_script_tag(content=(ROOT / "src/data/conference.js").read_text(encoding="utf-8"))
        page.add_script_tag(content=(ROOT / "app.js").read_text(encoding="utf-8"))
        page.wait_for_selector('main')
        return page

    def test_hero_exposes_identity_metadata_and_primary_action(self):
        page = self.page()
        self.assertEqual(page.locator("h1").inner_text(), "IEEE ISPA 2026")
        self.assertTrue(page.get_by_text("27–30 December 2026", exact=True).is_visible())
        self.assertTrue(page.get_by_text("Kuala Lumpur, Malaysia", exact=True).is_visible())
        self.assertEqual(page.get_by_role("link", name="Submit Paper").first.get_attribute("href"), "https://edas.info/N35627")
        page.close()

    def test_mobile_menu_and_anchor_navigation_are_accessible(self):
        page = self.page()
        menu = page.locator(".menu-button")
        menu.click()
        self.assertEqual(menu.get_attribute("aria-expanded"), "true")
        self.assertEqual(page.get_by_role("link", name="Dates").get_attribute("href"), "#dates")
        self.assertEqual(page.get_by_role("link", name="Chairs").get_attribute("href"), "#chairs")
        page.keyboard.press("Escape")
        self.assertEqual(menu.get_attribute("aria-expanded"), "false")
        page.close()

    def test_track_progressive_disclosure_reveals_full_topic_list(self):
        page = self.page()
        track = page.locator('[data-track="02"]')
        self.assertEqual(track.get_by_text("Generative AI, agents, and world model", exact=True).count(), 0)
        track.get_by_role("button", name="Explore Track").click()
        self.assertTrue(track.get_by_text("Generative AI, agents, and world model", exact=True).is_visible())
        self.assertEqual(track.get_by_role("button", name="Show Less").get_attribute("aria-expanded"), "true")
        page.close()

    def test_chairs_show_all_groups_without_role_switching(self):
        page = self.page()
        self.assertTrue(page.get_by_text("Geyong Min", exact=True).is_visible())
        self.assertTrue(page.get_by_text("Huazhong Liu", exact=True).is_visible())
        self.assertTrue(page.get_by_text("Rong Gu", exact=True).is_visible())
        self.assertEqual(page.get_by_role("button", name="Program Chairs").count(), 0)
        page.close()

    def test_submission_summary_and_primary_sections_are_present(self):
        page = self.page()
        for section_id in ["about", "dates", "tracks", "chairs", "submission"]:
            self.assertEqual(page.locator(f"#{section_id}").count(), 1)
        self.assertTrue(page.get_by_text("8 complimentary pages", exact=True).is_visible())
        self.assertTrue(page.get_by_text("Maximum 10 pages", exact=True).is_visible())
        self.assertTrue(page.get_by_text("Single-blind peer review", exact=True).is_visible())
        self.assertEqual(page.get_by_role("link", name="Submit via EDAS").get_attribute("href"), "https://edas.info/N35627")
        page.close()

    def test_organizers_display_official_logo_images(self):
        page = self.page()
        organizers = page.locator(".organizer-grid")
        self.assertEqual(organizers.locator("img").count(), 2)
        self.assertEqual(
            organizers.locator("img").evaluate_all("images => images.map(image => image.getAttribute('src'))"),
            ["assets/logos/zhengzhou-university.png", "assets/logos/zhejiang-normal-university.jpg"],
        )
        self.assertEqual(
            organizers.locator("img").evaluate_all("images => images.map(image => image.getAttribute('alt'))"),
            ["Zhengzhou University logo", "Zhejiang Normal University logo"],
        )
        page.close()

    def test_supporters_display_official_logo_images(self):
        page = self.page()
        supporters = page.locator(".logo-grid").first
        self.assertEqual(supporters.locator("img").count(), 6)
        self.assertEqual(
            supporters.locator("img").evaluate_all("images => images.map(image => image.getAttribute('src'))"),
            [
                "assets/logos/ieee.png",
                "assets/logos/ieee-computer-society.png",
                "assets/logos/ieee-tcsc.png",
                "assets/logos/ieee-hi-tc.jpg",
                "assets/logos/ieee-smc-tc-cybermatics.png",
                "assets/logos/cpss.png",
            ],
        )
        self.assertEqual(
            supporters.locator("img").evaluate_all("images => images.map(image => image.getAttribute('alt'))"),
            [
                "IEEE logo",
                "IEEE Computer Society logo",
                "IEEE TCSC logo",
                "IEEE HI-TC logo",
                "IEEE SMC TC on CyberMatics logo",
                "CPSS logo",
            ],
        )
        self.assertTrue(
            page.get_by_text("Official identities from the supporting organizations are shown below.", exact=True).is_visible()
        )
        page.close()

    def test_verified_chairs_display_their_official_portraits(self):
        page = self.page()
        portraits = page.locator(".chair-card img")
        self.assertEqual(portraits.count(), 20)
        self.assertEqual(
            portraits.evaluate_all("images => images.map(image => image.getAttribute('alt'))"),
            [
                "Portrait of Geyong Min",
                "Portrait of Nong Xiao",
                "Portrait of Huazhong Liu",
                "Portrait of Rong Gu",
                "Portrait of Jiawei Huang",
                "Portrait of Chubo Liu",
                "Portrait of Minchen Yu",
                "Portrait of Azreen Azman",
                "Portrait of Xiangli Yang",
                "Portrait of Shaojun Zou",
                "Portrait of Zhou Zhou",
                "Portrait of Yangbo Jiang",
                "Portrait of Xun Shao",
                "Portrait of Zhicai Zhang",
                "Portrait of Binbin Zhou",
                "Portrait of Ren Li",
                "Portrait of Yongqin Zhang",
                "Portrait of Minyi Guo",
                "Portrait of Laurence T. Yang",
                "Portrait of Liang Zhao",
            ],
        )
        self.assertEqual(
            page.get_by_alt_text("Portrait of Rong Gu").get_attribute("src"),
            "assets/chairs/rong-gu.png",
        )
        page.close()


if __name__ == "__main__":
    unittest.main()
