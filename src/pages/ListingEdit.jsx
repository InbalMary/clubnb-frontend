import { Link, Outlet, useNavigate } from 'react-router'
import { NavLink } from 'react-router-dom'

import { useState, useEffect } from 'react'

import { ImgUploader } from '../cmps/ImgUploader'


export function ListingEdit() {

    function onUploaded(imgUrl) {
        setCredentials({ ...credentials, imgUrl })
    }
const navigate = useNavigate()

    function onSave(ev){
        ev.preventDefault()
        console.log('Saving listing...' )
    }

    return (
        <form className="add-listing flex column align-center"  onSubmit={onSave}>
            <ul>listing type selection:<li> An entire place</li>
                <li>A room</li>
                <li>A shared room</li>
            </ul>
            <div>location (map)</div>
            <div>basic info
                Guests,<button>-</button><button>+</button><br />
                Bedrooms,<button>-</button><button>+</button><br />
                Beds,<button>-</button><button>+</button><br />
                Bathrooms,<button>-</button><button>+</button><br />
            </div>
            <div>Add some photos:
                <ImgUploader onUploaded={onUploaded} />
            </div>
            <div><ul>
                Tell guests what your place has to offer<br/>
                You can add more amenities after you publish your listing.
                <li>amenity a</li>
                <li>amenity b</li>
                <li>amenity c</li>
                </ul>
                </div>
            <div>txt area title</div>
            <div>txt area description</div>
            <div>Pricing info $189</div>
            <footer className="flex space-between">
            <button>Back</button>
          
            <button><Link to="/host">next</Link></button>
            </footer>
            <Outlet />
        </form>
    )
}