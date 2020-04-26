import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Link from "next/link";

const Navbar = ({ notFixed }) => {
    const user = useSelector(state => state.app ? state.app.user : null);
    const revealHeight = 150;
    const [revealNavbar, setRevealNavbar] = useState(false);
    const [revealMobileNavbar, setRevealMobileNavbar] = useState(false);

    useEffect(() => {
        document.body.style.overflow = revealMobileNavbar ? "hidden" : "auto";
    }, [revealMobileNavbar]);

    //initial event listener
    useEffect(() => {
        if(notFixed) {
            if (window.pageYOffset > revealHeight) setRevealNavbar(true);
            window.addEventListener("scroll", handleScroll);
        }
    }, []);

    //we need to re-add the event listener when revealNavbar changes, so the event listener has up to date state
    useEffect(() => {
        if (notFixed) {
            if (window.pageYOffset > revealHeight) setRevealNavbar(true);
            window.addEventListener("scroll", handleScroll);
        }
    }, [revealNavbar]);

    const handleScroll = () => {
        if (window.pageYOffset > revealHeight && !revealNavbar) {
            setRevealNavbar(true);
            window.removeEventListener("scroll", handleScroll);
        }
        else if (window.pageYOffset < revealHeight && revealNavbar) {
            setRevealNavbar(false);
            window.removeEventListener("scroll", handleScroll);
        }
    };

    return(
        <div>
            <nav style={{ width: "100%", backgroundColor: notFixed ? "transparent" : "white" }}>
                <ReusableNavbar user={user} setRevealMobileNavbar={setRevealMobileNavbar} notFixed />

                {notFixed && revealNavbar ?
                    <ReusableNavbar setRevealMobileNavbar={setRevealMobileNavbar} user={user} />
                    : null
                }

            </nav>

            {revealMobileNavbar ? <MobileNavbar setRevealMobileNavbar={setRevealMobileNavbar} user={user} /> : null}
        </div>
    );
};

export default Navbar;

const ReusableNavbar = ({ notFixed, user, setRevealMobileNavbar }) => (
    <nav className={notFixed ? "navbar_container--notFixed" : "navbar_container"}>
        {/* <Head><link href="https://fonts.googleapis.com/css?family=Roboto+Slab&display=swap" rel="stylesheet"></link></Head> */}

        <div className="navbar">
            <div className="navbar_left">
                <Link href="/"><a><img src="/logo.png" alt="Logo" /></a></Link>
                <Link href="/"><a>Home</a></Link>
                <Link href="/search"><a>Search</a></Link>
                <Link href="/my-movies"><a>My Movies</a></Link>
                <Link href="/my-tv-shows"><a>My TV Shows</a></Link>
            </div>

            <div className="navbar_right">
                {user ? 
                    <Link href="/auth/logout"><a className="navbar_authButton">Sign Out</a></Link>
                : 
                    <Link href="/auth/sign-in"><a className="navbar_authButton">Sign In</a></Link>}
                <img src="/hamburger.svg" alt="Menu button" onClick={() => setRevealMobileNavbar(true)} />
            </div>
        </div>
    </nav>
);

const MobileNavbar = ({ user, setRevealMobileNavbar }) => (
    <nav className={"navbarMobile"}>        
        <p onClick={() => setRevealMobileNavbar(false)}>✕</p>

        <Link href="/"><a><img src="/logo.png" alt="Logo" /></a></Link>
        <Link href="/"><a>Home</a></Link>
        <Link href="/search"><a>Search</a></Link>
        <Link href="/my-movies"><a>My Movies</a></Link>
        <Link href="/my-tv-shows"><a>My TV Shows</a></Link>
        
        {user ? null : <Link href="/auth/sign-in"><a className="navbarMobile_authButton">Sign In</a></Link>}       
    </nav>
);