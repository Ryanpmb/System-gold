import { Layer, Rect, Circle, Stage, Text, Transformer, Line, Image, Star, Path, Group } from "react-konva";
import iconWhats from "../../../../../../sources/icons konva/whats.png"
import iconTel from "../../../../../../sources/icons konva/tel.png"
import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useStamps } from '../../../../../../contexts/StampsContext';
import { useBox } from "../../../../../../contexts/BoxContext";
import { getClubImage } from "../../../../../../services/User/User";
import { Button } from "../../../../../../components/button/button";
import { ArrowLeft, ArrowRight, Plus } from "lucide-react";
import { ProductLayer } from "./ProductLayer";
import { ShapesLayer } from "./ShapesLayer";
import { CopiesLayer } from "./CopiesLayer";
import { TextsLayer } from "./TextsLayer";
import { BoxDataLayer } from "./BoxDataLayer";
import { ValidadeDateLayer } from "./ValidateDateLayer";
import { InformationsLayer } from "./InformationsLayer";
import { StampsLayer } from "./StampsLayer";

export const StageContent = ({
    setStageQuantity,
    stageQuantity,
    handleTransformEndAndSaveToHistory,
    groupRefs,
    handleTransformGroup,
    groupActive,

    selectedElements,
    handleDeselect,
    shapesRefs,
    selectedTabloid,
    stageRef,
    setSelectedShape,
    setSelectedText,
    backgroundImage,
    desabilitarBackground,
    handleMouseEnter,
    handleMouseLeave,
    handleSelect,
    handleDragMove,
    handleDragEnd,
    selectedShape,
    transformerRef,
    guides,
    enableTextEditing,
    tempTextValue,
    editingTextIndex,
    handleTextChange,
    saveTextChange,
    inputPosition,
    user,
    adress,
    addNewStage,
    stageId,
    prevStage,
    nextStage


}) => {

    const { id } = useParams()
    const [logo, setLogo] = useState(null)
    const { stampsKonva } = useStamps();
    const { boxData } = useBox();
    const [konvaScale, setKonvaScale] = useState(1);
    const [positionKonva, setPositionKonva] = useState({ x: 0, y: 0 })

    const currentStage = stageQuantity.find((stage) => stage?.id === stageId);

    const handleWheel = (e) => {
        e.evt.preventDefault();

        const scaleBy = 1.1;
        const stage = e.target.getStage();
        const oldScale = stage.scaleX();

        const mousePointTo = {
            x: stage.getPointerPosition().x / oldScale - stage.x() / oldScale,
            y: stage.getPointerPosition().y / oldScale - stage.y() / oldScale,
        };

        const newScale = e.evt.deltaY < 0 ? oldScale * scaleBy : oldScale / scaleBy;

        setKonvaScale(newScale);
        setPositionKonva({
            x: -(mousePointTo.x - stage.getPointerPosition().x / newScale) * newScale,
            y: -(mousePointTo.y - stage.getPointerPosition().y / newScale) * newScale,
        });

    }

    useEffect(() => {
        const fetchImg = async () => {
            const imgData = await getClubImage(id)
            const img = new window.Image()
            img.src = imgData.data
            img.onload = () => {
                setLogo(img)
            }

            stageRef.current.batchDraw()
        }

        fetchImg();
    }, [id])




    const [logoWhats, setLogoWhats] = useState(null);
    const [logoTel, setLogoTel] = useState(null);
    const [textSize, setTextSize] = useState({ width: 0, height: 0 });
    const textRefAdress = useRef();

    const informations = user ? JSON.parse(user?.Adress) : null

    useEffect(() => {
        if (textRefAdress.current) {
            // Calcula o tamanho do primeiro texto
            const width = textRefAdress.current.getTextWidth();
            const height = textRefAdress.current.getTextHeight();
            setTextSize({ width, height });
        }
    }, [textRefAdress.current]);

    useEffect(() => {
        const imgWhats = () => {
            const img = new window.Image();
            img.src = iconWhats;
            img.onload = () => { setLogoWhats(img); }

        }
        const imgTel = () => {
            const img = new window.Image();
            img.src = iconTel;
            img.onload = () => {
                setLogoTel(img)
            }
        }

        imgWhats()
        imgTel()
    }, [])

    const deleteKonvaStage = (konvaStageId) => {
        setStageQuantity((prevStage) => {
            return prevStage.filter((stage) => stage?.id !== konvaStageId);
        })

        prevStage();
    }

    return (
        <div className="konva-content" style={{ position: "relative", marginRight: '40px', marginTop: "15%" }}>
            {editingTextIndex !== null && (
                <input
                    className="changeText"
                    type="text"
                    value={tempTextValue}
                    onChange={handleTextChange}
                    onBlur={saveTextChange} // Salva ao sair do campo de input
                    autoFocus // Foca no input automaticamente
                    style={{
                        position: "absolute",
                        top: inputPosition.y,
                        left: inputPosition.x,
                        width: 200,
                        border: 0,
                        fontSize: "22px",
                        padding: "4px",
                        background: "#fff",
                        outline: "none",
                        borderRadius: 0,
                        zIndex: 1000
                    }}
                />
            )}

            <Stage
                className="Stage"
                ref={stageRef}
                style={{ border: '1px solid', backgroundColor: 'white' }}
                width={selectedTabloid?.width ?? 600}
                height={selectedTabloid?.height ?? 800}
                scaleX={konvaScale}
                scaleY={konvaScale}
                x={positionKonva.x}
                y={positionKonva.y}
                onWheel={handleWheel}
                onMouseDown={(e) => {
                    if (e.target === e.target.getStage()) {
                        setSelectedShape(null);
                        setSelectedText(null);
                        handleDeselect()
                    }
                }}>

                <Layer>
                    {/* Linha vertical para o alinhamento central */}
                    {guides.vertical && (
                        <Line
                            points={[guides.vertical, 0, guides.vertical, window.innerHeight]}
                            stroke="red"
                            strokeWidth={1}
                            dash={[4, 6]} // Guia tracejada
                        />
                    )}

                    {/* Linha horizontal para o alinhamento central */}
                    {guides.horizontal && (
                        <Line
                            points={[0, guides.horizontal, window.innerWidth, guides.horizontal]}
                            stroke="red"
                            strokeWidth={1}
                            dash={[4, 6]} // Guia tracejada
                        />
                    )}
                </Layer>
                


                <Layer
                    id="shapesLayer"
                >
                    {
                        currentStage?.shapes?.map((shape) => (
                            <ShapesLayer
                                shape={shape}
                                handleSelect={handleSelect}
                                handleDragMove={handleDragMove}
                                handleDragEnd={handleDragEnd}
                                shapesRefs={shapesRefs}
                                handleTransformEndAndSaveToHistory={handleTransformEndAndSaveToHistory}
                                handleMouseEnter={handleMouseEnter}
                                handleMouseLeave={handleMouseLeave}
                            />
                        ))
                    }
                </Layer>

                <Layer
                    id="copiesLayer"
                >
                    {
                        currentStage?.copies?.map((copy) => (
                            <CopiesLayer
                                copy={copy}
                                handleSelect={handleSelect}
                                handleDragMove={handleDragMove}
                                handleDragEnd={handleDragEnd}
                                shapesRefs={shapesRefs}
                                handleTransformEndAndSaveToHistory={handleTransformEndAndSaveToHistory}
                                handleMouseEnter={handleMouseEnter}
                                handleMouseLeave={handleMouseLeave}
                            />
                        ))
                    }
                </Layer>

                <Layer>
                    {
                        currentStage?.boxData?.map((box) => (
                            <BoxDataLayer
                                key={box.id}
                                box={box}
                                handleSelect={handleSelect}
                                shapesRefs={shapesRefs}
                                handleMouseEnter={handleMouseEnter}
                                handleMouseLeave={handleMouseLeave}
                            />
                        ))
                    }
                </Layer>

                <Layer
                    id="productLayer"
                >
                    {
                        currentStage?.products?.map((product, index) => (
                            <ProductLayer
                                key={product.id}
                                product={product}
                                index={index}
                                handleSelect={handleSelect}
                                handleDragMove={handleDragMove}
                                handleDragEnd={handleDragEnd}
                                shapesRefs={shapesRefs}
                                handleTransformEndAndSaveToHistory={handleTransformEndAndSaveToHistory}
                                handleMouseEnter={handleMouseEnter}
                                handleMouseLeave={handleMouseLeave}
                                enableTextEditing={enableTextEditing}
                                groupRefs={groupRefs}
                                handleTransformGroup={handleTransformGroup}
                                logo={logo}
                            />

                        ))
                    }
                </Layer>

                <Layer
                    id="textLayer"
                >
                    {
                        currentStage?.texts?.map((text) => (
                            <TextsLayer
                                key={text.id}
                                text={text}
                                handleSelect={handleSelect}
                                handleDragEnd={handleDragEnd}
                                enableTextEditing={enableTextEditing}
                                shapesRefs={shapesRefs}
                            />
                        ))
                    }
                </Layer>

                <Layer>
                    {
                        currentStage?.hasValidateDate && (
                            <ValidadeDateLayer
                                handleSelect={handleSelect}
                                formatedDateInitial={currentStage.formatedDateInitial}
                                formatedDateFinal={currentStage.formatedDateFinal}
                            />
                        )
                    }
                </Layer>

                <Layer>
                    <InformationsLayer
                        informations={informations}
                        adress={adress}
                        handleSelect={handleSelect}
                        logoTel={logoTel}
                        logoWhats={logoWhats}
                    />
                </Layer>

                <Layer>
                    {
                        currentStage?.stampsKonva.map((stamp) => (
                            <StampsLayer
                                key={stamp.id}
                                stamp={stamp}
                                handleSelect={handleSelect}
                                shapesRefs={shapesRefs}
                            />
                        ))
                    }
                    {
                        selectedShape && (
                            <Transformer
                                ref={transformerRef}
                                rotateEnabled={true}
                                enabledAnchors={[
                                    'top-left',
                                    'top-right',
                                    'top-center',
                                    'bottom-left',
                                    'bottom-right',
                                    'bottom-center',
                                    'middle-left',
                                    'middle-right'
                                ]}
                                boundBoxFunc={(oldBox, newBox) => {
                                    if (newBox.width < 20 || newBox.height < 20) {
                                        return oldBox;
                                    }

                                    return newBox;
                                }}
                            />
                        )
                    }
                    {selectedElements.length > 0 && (
                        <Transformer
                            ref={transformerRef}
                            boundBoxFunc={(oldBox, newBox) => {
                                if (newBox.width < 20 || newBox.height < 20) {
                                    return oldBox;
                                }
                                return newBox;
                            }}
                        />
                    )}
                </Layer>



            </Stage>




            <div style={{ display: "flex", gap: "10px" }}>

                <Button
                    onClick={() => {
                        setKonvaScale(1)
                        setPositionKonva({ x: 0, y: 0 })
                    }}
                    style={{
                        width: "20%",
                        marginTop: "10px"
                    }}
                >
                    Voltar Padrão
                </Button>

                {
                    stageQuantity.length > 1 && (
                        <Button
                            style={{
                                width: "10%",
                                marginTop: "10px"
                            }}
                            onClick={() => prevStage()}
                            disabled={currentStage?.id === 1}
                        >
                            <ArrowLeft />
                        </Button>
                    )
                }

                <Button
                    onClick={() => {
                        addNewStage()
                    }}
                    style={{
                        width: "10%",
                        marginTop: "10px"
                    }}
                >
                    <Plus />
                </Button>
                {
                    stageQuantity.length > 1 && (
                        <Button
                            style={{
                                width: "10%",
                                marginTop: "10px"
                            }}
                            onClick={() => nextStage()}
                            disabled={currentStage?.id === stageQuantity.length}
                        >
                            <ArrowRight />
                        </Button>
                    )
                }
                {
                    stageQuantity.length > 1 && (
                        <Button
                            style={{
                                width: "10%",
                                marginTop: "10px"
                            }}
                            onClick={() => deleteKonvaStage(currentStage?.id)}
                            disabled={currentStage?.id === 1}
                        >
                            Apagar
                        </Button>
                    )
                }
            </div>
        </div>
    )
}