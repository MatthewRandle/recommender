import React from "react";
import Link from "next/link";

const Footer = () => {
    return(
        <footer className="footer">
            <div className="footer_top">
                <div className="footer_column">
                    <img src="/logo.png" alt="Commenze Logo" />
                    <p>contact@commenze.com</p>
                </div>

                <div className="footer_column">
                    <h2>Resources</h2>
                    <Link href="/documentation"><a>Documentation</a></Link>
                    <Link href="/pricing"><a>Pricing</a></Link>
                    <Link href="/features"><a>Features</a></Link>
                </div>

                <div className="footer_column">
                    <h2>Legal</h2>
                    <Link href="/privacy-policy"><a>Privacy Policy</a></Link>
                    <Link href="/cookie-policy"><a>Cookie Policy</a></Link>
                    <Link href="/terms-and-conditions"><a>Terms & Conditions</a></Link>
                </div>

                <div className="footer_social">
                    <img src="/twitter.png" alt="Twitter Logo" />
                    <img src="/facebook.png" alt="Facebook Logo" />
                </div>
            </div>

            <div className="footer_bottom">
                <div className="footer_bottom_content">
                    <div>
                        <h2>Sign up to our newsletter</h2>
                        <p>Never miss out on new features and changes</p>
                    </div>

                    <form>
                        <input type="email" name="email" />
                        <button type="submit">SUBSCRIBE</button>
                    </form>
                </div>
            </div>
        </footer>
    );
};

export default Footer;