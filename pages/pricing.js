import React from "react";
import Head from "next/head";
import Link from "next/link";

import Faq from "../components/Faq";
import Footer from "../components/Footer";
import initialSetupFetch from "../utils/initialSetupFetch";
import Navbar from "../components/Navbar";

const Pricing = () => {
    return (
        <div className="pricing_container">
            <Head>
                <title>Commenze Pricing</title>
            </Head>

            <Navbar notFixed />

            <div className="pricing">
                <h1>Simple pricing that scales with your business</h1>
                <p className="pricing_subheader">Try for free for 7 days</p>

                <div className="pricing_models">
                    <div className="pricing_model" id="personal">
                        <h3>Personal</h3>
                        <span><h2>$15</h2>/month</span>

                        <Link href="/"><a>CHOOSE PLAN</a></Link>
                    </div>

                    <div className="pricing_model" id="business">
                        <h2 className="pricing_mostPopular">Most Popular Choice</h2>
                        <h3>Business</h3>
                        <span><h2>$89</h2>/month</span>

                        <Link href="/"><a>CHOOSE PLAN</a></Link>
                    </div>

                    <div className="pricing_model" id="enterprise">
                        <h3>Enterprise</h3>
                        <p>Custom packages designed around your large business</p>

                        <Link href="/"><a>CONTACT US</a></Link>
                    </div>
                </div>

                
            </div>

            <div className="pricing_features">
                <h2 className="pricing_header">Features</h2>
            </div>


            <div className="pricing_faqs">
                <h2 className="pricing_header">Frequently asked questions</h2>

                <Faq question="How do I do this?" answer="The answer to this question is very simple. Simply do this then that and then you're done." />
                <Faq question="How do I do this?" answer="The answer to this question is very simple. Simply do this then that and then you're done." />
                <Faq question="How do I do this?" answer="The answer to this question is very simple. Simply do this then that and then you're done." />
                <Faq question="How do I do this?" answer="The answer to this question is very simple. Simply do this then that and then you're done." />
                <Faq question="How do I do this?" answer="The answer to this question is very simple. Simply do this then that and then you're done." />
            </div>

            <div className="pricing_ctas">
                <div className="pricing_cta">
                    <div>
                        <h2>Ready to build a community?</h2>
                        <p>Get setup in minutes.</p>
                    </div>

                    <Link href="/documentation"><a className="pricing_cta_getStarted">GET STARTED</a></Link>
                </div>
            </div>

            <Footer />
        </div>
    );
};

Pricing.getInitialProps = async function ({ query, store, req, res }) {
    await initialSetupFetch(store, req);

    return { ignore: true };
}

export default Pricing;