import { Outlet, useNavigate } from 'react-router'
import { NavLink } from 'react-router-dom'

import { useState, useEffect } from 'react'

import { userService } from '../services/user'

export function BecomeHostForm() {
    return (
        <section>
            <header className="flex justify-between"> <span>logo</span><button>exit</button></header>
            <div className="main hosting flex justify-evenly">
                <pre>It’s easy to get started on Airbnb</pre>
                <div className="flex column">
                    <pre>1
                        Tell us about your place
                        Share some basic info, like where
                        it is and how many guests can stay.</pre>

                    <pre>2
                        Make it stand out
                        Add 5 or more photos plus a title and description—we’ll help you out.</pre>
                    <pre>3
                        Finish up and publish
                        Choose a starting price, verify a few details, then publish your listing.</pre>
                </div>
            </div>
            <nav className="flex">
                <NavLink to="add-listing-about">next</NavLink>
            </nav>
            <Outlet />
        </section>
    )
}
