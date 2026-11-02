import { useCallback, useEffect, useRef, useState } from "react";

export default function useModalCloseAnimation(onClose = () => {}, exitMs = 220) {
    const closeTimerRef = useRef(null);
    const [isClosing, setIsClosing] = useState(false);
    const [isOpen, setIsOpen] = useState(true);

    const closeWithAnimation = useCallback(() => {
        if (isClosing) return;
        setIsClosing(true);
        setIsOpen(false);
        closeTimerRef.current = setTimeout(() => {
            onClose();
        }, exitMs);
    }, [exitMs, isClosing, onClose]);

    useEffect(() => {
        return () => {
            if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
        };
    }, []);

    return { isOpen, isClosing, closeWithAnimation, exitMs };
}
