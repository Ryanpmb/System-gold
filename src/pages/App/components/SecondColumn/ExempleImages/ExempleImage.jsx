import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './index.css'
import { motion } from "framer-motion";
import { useState } from 'react';
import { faCircleLeft, faCircleRight } from '@fortawesome/free-regular-svg-icons';

const ExempleImage = ({ blobImg }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const goNext = () => {
        setCurrentIndex((prev) => (prev + 1) % blobImg.length);
    };

    const goPrev = () => {
        setCurrentIndex((prev) => (prev - 1 + blobImg.length) % blobImg.length);
    };

    if (blobImg.length === 0) return <p>Carregando imagens...</p>;
    return (
        <div className="carousel-container">
            
            <div className="carousel-main">
                
                {/* Imagem principal */}
                <motion.div
                    className="carousel-card main-card"
                    key={currentIndex}
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    style={{display:'flex', flexDirection: "column"}}
                >
                    <h3 style={{margin: 0}}>Exemplos</h3>
                    <img src={blobImg[currentIndex]} alt="Imagem Principal" className="card-image" />
                </motion.div>

                {/* Imagem anterior */}
                <motion.div
                    className="carousel-card previous-card"
                    key={(currentIndex - 1 + blobImg.length) % blobImg.length}
                    initial={{ opacity: 0.5, x: -50 }}
                    animate={{ opacity: 0.7, x: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                    <img
                        src={blobImg[(currentIndex - 1 + blobImg.length) % blobImg.length]}
                        alt="Imagem Anterior"
                        className="card-image"
                    />
                </motion.div>

                {/* Imagem seguinte */}
                <motion.div
                    className="carousel-card next-card"
                    key={(currentIndex + 1) % blobImg.length}
                    initial={{ opacity: 0.5, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 100 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                    <img
                        src={blobImg[(currentIndex + 1) % blobImg.length]}
                        alt="Imagem Seguinte"
                        className="card-image"
                    />
                </motion.div>
            </div>


            <div className="carousel-thumbnails-container">
                <button onClick={goPrev} className="prev-button"><FontAwesomeIcon size='2x' icon={faCircleLeft} /></button>

                <div className="carousel-thumbnails">
                    {blobImg.map((img, index) => (
                        <motion.div
                            key={index}
                            className={`thumbnail ${index === currentIndex ? "active" : ""}`}
                            onClick={() => setCurrentIndex(index)}
                            whileHover={{ scale: 1.1 }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        >
                            <img src={img} alt={`Miniatura ${index}`} className="thumbnail-image" />
                        </motion.div>
                    ))}
                </div>

                <button onClick={goNext} className="next-button"><FontAwesomeIcon size='2x' icon={faCircleRight} /></button>
            </div>

        </div>
    );
};


export default ExempleImage;