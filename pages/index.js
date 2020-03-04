import React from "react";
import Head from "next/head";

import Footer from "../components/Footer";
import initialSetupFetch from "../utils/initialSetupFetch";
import Navbar from "../components/Navbar";

const Index = () => {
    return(
        <div>
            <Head>
                <title>Fully Customized Comment Sections In Minutes  - Commenze</title>
            </Head>

            <Navbar notFixed />

            <div className="home">
                <div className="hero_container">
                    <div className="hero">
                        <div className="hero_content">
                            <div>
                                <h1>Turn your audience into a <span>community</span></h1>
                                <p>Fully customizable comment sections that will help you build a community based around your product.</p>
                                <button className="hero_tryButton">Try For Free</button>
                                <button className="hero_demoButton">View Demo</button>
                            </div>
                        </div>

                        <img src="/logo.png" />
                    </div>
                </div>               

                <div className="home_commentSection">
                    <div className="home_commentSection_content">
                        <h2><span>Breathe life</span> into your product and get your <span>users talking</span></h2>
                        <p>Create fully customizable comment sections that will engage your users and help you build a community around your product.</p>
                    </div>

                    <div className="home_commentSection_animation">
                        <div className="home_commentSection_comment">
                            <img src="/home-profile-picture.png" alt="Profile Picture" />

                            <div className="home_commentSection_comment_content">
                                <p id="username">Matthew</p>
                                <p id="comment">Wow! This product is so cool! I can change everything and make it match my sites theme!</p>
                            </div>

                            <p id="timestamp">2 Days Ago</p>
                            <p id="reply">Reply</p>
                        </div>
                    </div>
                </div>

                <div className="home_authentication">
                    <div className="home_authentication_content">
                        <h2>Make it <span>easy</span> to join in on the <span>conversation</span></h2>
                        <p>Converting your readers into talkers has never been easier with super simple, customizable user authentication.
                        Allow your users to sign in through your site or connect them directly to the Commenze network.</p>
                    </div>

                    <img id="auth" src="/auth.png" />
                    <img id="social" src="/social-icons.png" />
                </div>
            </div>

            <Footer />
        </div>           
    );
};

Index.getInitialProps = async function ({ query, store, req, res }) {
    await initialSetupFetch(store, req);

    return { ignore: true };
}

export default Index;