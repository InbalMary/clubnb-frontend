import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { stayService } from '../services/stay/'
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service'

import { ImgUploader } from "../cmps/ImgUploader";
import { DateRangePicker } from "../cmps/DateRangePicker";

export function StayEdit() {
    const navigate = useNavigate()

    const handleSaveExit = () => {
        navigate('/')
    }

    const handleNext = () => {
        console.log('Moving to next step')
    }

    const handleBack = () => {
        navigate('/')
    }

    return (
        <div className="edit-contanier">
            <header className="edit-header">
                <div className="logo-black-contanier">
                    <img src={`/img/logo-black.svg`} alt="logo-black" className="logo-black-icon" />
                </div>
                <div className="header-actions">
                    <button className="btn btn-pill questions-button">Questions?</button>
                    <button className="btn btn-pill save-exit-button" onClick={handleSaveExit}>
                        Save & exit
                    </button>
                </div>
            </header>

            <main className="step-main-content">
                <div className="step-left">
                    <div className="step-label">Step 1</div>
                    <h1 className="step-main-title">Tell us about your place</h1>
                    <p className="step-main-description">
                        In this step, we'll ask you which type of property you have and if
                        guests will book the entire place or just a room. Then let us know
                        the location and how many guests can stay.
                    </p>
                </div>

                <div className="step-right">
                    <video
                        className="step-video"
                        autoPlay
                        loop
                        muted
                        playsInline
                    >
                        <source src="/img/video/listing-step1-animation.mp4" type="video/mp4" />
                    </video>
                </div>
            </main>

            <footer className="step-footer">
                <button className="back-button" onClick={handleBack}>
                    Back
                </button>
                <button className="btn btn-black next-button" onClick={handleNext}>
                    Next
                </button>
            </footer>
        </div>
    )
}