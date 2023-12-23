import React, { useRef } from "react";

export default function Popup({ visible, setVisible, postData }) {
    const modalRef = useRef(null);

    return (
        <>
            {visible ? (
                <div
                    style={{
                        position: "fixed",
                        display: "flex",
                        direction: "row",
                        top: 0,
                        left: 0,
                        width: "100vw",
                        height: "100vh",
                        zIndex: "100",
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: "rgba(0,0,0,0.4)",
                    }}
                    onClick={(e) => {
                        if (modalRef.current.contains(e.target)) {
                            return;
                        }
                        setVisible(false);
                    }}
                >
                    <div className='d-flex justify-content-center' style={{ backgroundColor: "#fff", width: '50%' }} ref={modalRef}>
                        <div className='card border border-dark my-1 rounded-0'>
                            <div><b>Title</b> : {postData.title}</div>
                            <div title={postData.body}><b>Posts</b> :{postData.body}</div>
                        </div>
                    </div>
                </div>
            ) : (
                <></>
            )}
        </>
    );
}