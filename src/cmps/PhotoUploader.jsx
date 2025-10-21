import { useState } from "react"
import { svgControls } from "./Svgs"
import { uploadService } from "../services/upload.service"

export function PhotoUploader({ onUploaded = null, isOpen, onClose }) {
    const [isUploading, setIsUploading] = useState(false)
    const [dragActive, setDragActive] = useState(false)
    const [selectedImages, setSelectedImages] = useState([])

    async function handleFileSelect(ev) {
        const files = Array.from(ev.target.files || [])
        if (!files.length) return

        setIsUploading(true)
        const uploadedUrls = []

        for (const file of files) {
            const res = await uploadService.uploadImg({ target: { files: [file] } })
            uploadedUrls.push(res.secure_url)
        }

        setSelectedImages(prev => [...prev, ...uploadedUrls])
        setIsUploading(false)
    }

    async function handleDrop(e) {
        e.preventDefault()
        e.stopPropagation()
        setDragActive(false)

        const files = Array.from(e.dataTransfer.files || [])
        if (!files.length) return

        setIsUploading(true)
        const uploadedUrls = []

        for (const file of files) {
            const res = await uploadService.uploadImg({ target: { files: [file] } })
            uploadedUrls.push(res.secure_url)
        }

        setSelectedImages(prev => [...prev, ...uploadedUrls])
        setIsUploading(false)
    }

    function handleDrag(e) {
        e.preventDefault()
        e.stopPropagation()
        if (e.type === "dragenter" || e.type === "dragover") setDragActive(true)
        else if (e.type === "dragleave") setDragActive(false)
    }

    function handleDeleteImage(index) {
        setSelectedImages(prev => prev.filter((_, i) => i !== index))
    }

    function handleUpload() {
        selectedImages.forEach(url => {
            onUploaded && onUploaded(url)
        })
        setSelectedImages([])
        onClose()
    }

    function handleCancel() {
        setSelectedImages([])
        onClose()
    }

    if (!isOpen) return null

    return (
        <div className="upload-modal-overlay" onClick={handleCancel}>
            <div className="upload-modal" onClick={(e) => e.stopPropagation()}>
                <div className="upload-modal-header">
                    <button className="modal-close-button btn btn-round" onClick={handleCancel}>
                        <img src="/img/close.svg" alt="close icon" className="camera-icon header-modal-action-icons" />
                    </button>
                    <h2 className="upload-modal-title">Upload photos</h2>
                    <label htmlFor="imgUpload" className="modal-add-button btn btn-round">
                        <img src="/img/plus.svg" alt="plus icon" className="camera-icon header-modal-action-icons" />
                    </label>
                </div>

                <p className="upload-modal-subtitle">
                    {selectedImages.length === 0
                        ? 'No items selected'
                        : `${selectedImages.length} item${selectedImages.length > 1 ? 's' : ''} selected`}
                </p>

                {selectedImages.length > 0 ? (
                    <div className="modal-preview-grid">
                        {selectedImages.map((img, idx) => (
                            <div key={idx} className="modal-preview-item">
                                <img src={img} alt={`preview ${idx}`} />
                                <button
                                    className="modal-delete-button btn-round btn-black"
                                    onClick={() => handleDeleteImage(idx)}
                                >{svgControls.deleteeModal}
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div
                        className={`upload-drop-zone ${dragActive ? 'drag-active' : ''}`}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                    >
                        <div className="upload-icon">
                            <img src="/img/upload-photo.svg" alt="upload photo icon" className="upload-photo camera-icon" />
                        </div>

                        <h3 className="upload-title">Drag and drop</h3>
                        <p className="upload-subtitle">or browse for photos</p>

                        <label htmlFor="imgUpload" className="btn btn-black browse-button">
                            {isUploading ? 'Uploading...' : 'Browse'}
                        </label>
                    </div>
                )}

                <input
                    type="file"
                    id="imgUpload"
                    accept="image/*"
                    multiple
                    onChange={handleFileSelect}
                    style={{ display: 'none' }}
                />

                <div className="upload-modal-footer">
                    <button className="back-button" onClick={handleCancel}>Cancel</button>
                    <button
                        className="btn btn-black"
                        disabled={selectedImages.length === 0}
                        onClick={handleUpload}
                    >
                        Upload
                    </button>
                </div>
            </div>
        </div>
    )
}