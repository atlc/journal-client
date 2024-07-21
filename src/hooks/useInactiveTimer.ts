// import { useEffect, useState } from "react";

// const SECONDS = 1000;
// const MINUTES = 60 * SECONDS;
// const IDLE_TIMEOUT = 15 * MINUTES;
// const REFRESH_INTERVAL = 10 * SECONDS;

// export default async function useInactiveTimer() {
//     const [timer, setTimer] = useState(IDLE_TIMEOUT);
//     const [intervalId, setIntervalId] = useState(0);

//     function resetTimer() {
//         setTimer(IDLE_TIMEOUT);
//     }

//     useEffect(() => {
//         let interval = setInterval(() => {
//             setTimer((time) => time - REFRESH_INTERVAL);
//         }, REFRESH_INTERVAL);

//         setIntervalId(interval);

//         window.addEventListener("mousemove", resetTimer);

//         return () => {
//             window.removeEventListener("mousemove", resetTimer);
//             window.clearInterval(intervalId);
//         };
//     }, []);

//     useEffect(() => {
//         console.log({ timer });

//         if (timer <= 0) {
//             alert("A logged out due to inactivity");
//         }
//     }, [timer]);
// }
