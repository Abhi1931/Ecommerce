
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import './QuantitySelector.css';

function QuantitySelector({ quantity = 1, setQuantity, max = 10 }) {
    const [direction, setDirection] = useState("up"); // 'up' or 'down'
    const [internalQty, setInternalQty] = useState(Number(quantity) || 1);


    useEffect(() => {
        const qNum = Number(quantity) || 1;
        if (qNum > internalQty) setDirection("up");
        else if (qNum < internalQty) setDirection("down");
        setInternalQty(qNum);

    }, [quantity]);

    const clamp = (value) => {
        let v = Number(value) || 1;
        if (max != null) v = Math.min(v, Number(max));
        return Math.max(1, v);
    };

    const handleDecrease = () => {
        const next = clamp(internalQty - 1);
        setInternalQty(next);
        setQuantity(next);
    };

    const handleIncrease = () => {
        const next = clamp(internalQty + 1);
        setInternalQty(next);
        setQuantity(next);
    };

    return (
        <div className="qty-section">
            <span className="qty-label">QUANTITY</span>

            <div className="qty-container">
                <button
                    type="button"
                    className="qty-btn qty-btn-left"
                    onClick={handleDecrease}
                    disabled={internalQty <= 1}
                >
                    –
                </button>

                <div className="qty-display-wrapper">
                    <AnimatePresence mode="wait" initial={false}>
                        <motion.div
                            key={internalQty}
                            initial={{
                                opacity: 0,
                                x: direction === "up" ? 20 : -20,
                            }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{
                                opacity: 0,
                                x: direction === "up" ? -20 : 20,
                            }}
                            transition={{ duration: 0.18 }}
                            className="qty-display"
                        >
                            {internalQty}
                        </motion.div>
                    </AnimatePresence>
                </div>

                <button
                    type="button"
                    className="qty-btn qty-btn-right"
                    onClick={handleIncrease}
                    disabled={max != null && internalQty >= max}
                >
                    +
                </button>
            </div>
        </div>
    );
}

export default QuantitySelector;