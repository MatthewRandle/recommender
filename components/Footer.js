import React from "react";
import Link from "next/link";

const Footer = () => {
    return(
        <footer className="footer">
            <div className="footer_top">
                <div className="footer_column">
                    <img src="/logo.png" alt="Recommender Logo" />
                </div>

                <div className="footer_column">
                    <h2>Legal</h2>
                    <Link href="/privacy-policy"><a>Privacy Policy</a></Link>
                    <Link href="/cookie-policy"><a>Cookie Policy</a></Link>
                    <Link href="/terms-and-conditions"><a>Terms & Conditions</a></Link>
                </div>
            </div>

            <div className="footer_bottom">
                <div className="footer_bottom_content">
                    <p>Matthew Randle, w16016867, matthew.randle@northumbria.ac.uk</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;