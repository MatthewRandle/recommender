import React from "react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Terms = () => {
    return(
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <Navbar />

            <div className="terms">
                <h1>Cookie Policy for Recommender</h1>

                <p>This is the Cookie Policy for Recommender, accessible from https://recommender.herokuapp.com/</p>

                <p><strong>What Are Cookies</strong></p>

                <p>As is common practice with almost all professional websites this site uses cookies, which are tiny files that are downloaded to your computer, to improve your experience. This page describes what information they gather, how we use it and why we sometimes need to store these cookies. We will also share how you can prevent these cookies from being stored however this may downgrade or 'break' certain elements of the sites functionality.</p>

                <p>For more general information on cookies, please read <a href="https://www.cookieconsent.com/what-are-cookies/">"What Are Cookies"</a>.</p>

                <p><strong>How We Use Cookies</strong></p>

                <p>We use cookies for a variety of reasons detailed below. Unfortunately in most cases there are no industry standard options for disabling cookies without completely disabling the functionality and features they add to this site. It is recommended that you leave on all cookies if you are not sure whether you need them or not in case they are used to provide a service that you use.</p>

                <p><strong>Disabling Cookies</strong></p>

                <p>You can prevent the setting of cookies by adjusting the settings on your browser (see your browser Help for how to do this). Be aware that disabling cookies will affect the functionality of this and many other websites that you visit. Disabling cookies will usually result in also disabling certain functionality and features of the this site. Therefore it is recommended that you do not disable cookies.</p>

                <p><strong>The Cookies We Set</strong></p>

                <ul>

                    <li>
                        <p>Account related cookies</p>
                        <p>If you create an account with us then we will use cookies for the management of the signup process and general administration. These cookies will usually be deleted when you log out however in some cases they may remain afterwards to remember your site preferences when logged out.</p>
                    </li>

                    <li>
                        <p>Login related cookies</p>
                        <p>We use cookies when you are logged in so that we can remember this fact. This prevents you from having to log in every single time you visit a new page. These cookies are typically removed or cleared when you log out to ensure that you can only access restricted features and areas when logged in.</p>
                    </li>






                </ul>

                <p><strong>Third Party Cookies</strong></p>

                <p>In some special cases we also use cookies provided by trusted third parties. The following section details which third party cookies you might encounter through this site.</p>

                <ul>



                    <li>
                        <p>From time to time we test new features and make subtle changes to the way that the site is delivered. When we are still testing new features these cookies may be used to ensure that you receive a consistent experience whilst on the site whilst ensuring we understand which optimisations our users appreciate the most.</p>
                    </li>







                </ul>

                <p><strong>More Information</strong></p>

                <p>Hopefully that has clarified things for you and as was previously mentioned if there is something that you aren't sure whether you need or not it's usually safer to leave cookies enabled in case it does interact with one of the features you use on our site. This Cookies Policy was created with the help of the <a href="https://www.cookiepolicygenerator.com/cookie-policy-generator/">Cookies Policy Template Generator</a> and the <a href="https://www.privacypolicytemplate.net/">Privacy Policy Template Generator</a>.</p>

                <p>However if you are still looking for more information then you can contact us through one of our preferred contact methods:</p>

                <ul>
                    <li>Email: randle.matthew@hotmail.co.uk</li>

                </ul>
            </div>

            <Footer />
        </div>
    )
}

export default Terms;