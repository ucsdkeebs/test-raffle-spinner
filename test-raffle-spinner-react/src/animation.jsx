// import {useState, useEffect} from 'react';
// function AnimationRenderer({onAnimate}) {

//     const images = require.context('./img/Animation_Frames', true);
//     const frames = images.keys().map(image => images(image));
  
//     const [currentFrameIndex, setCurrentFrameIndex] = useState(0);
//     const [isAnimating, setIsAnimating] = useState(false);
  
//     const handleImageClick = () => {
//         setIsAnimating(prevIsAnimating => {
//           if (!prevIsAnimating) {
//             setCurrentFrameIndex(0); // Reset to the first frame if animation starts
//             // onAnimate();
//             //setTimeout(async () => {
//             //    await onAnimate(); // Call the function passed from App to perform additional actions
//             //}, 4000); // Delay of 3000 ms
//             return !prevIsAnimating;
//           }
//           else {
//             return prevIsAnimating;
//           }
//         });
//       };
  
//     useEffect(() => {
//       let animationInterval;
//       // let counter = 0;
//       if (isAnimating) {
//         animationInterval = setInterval(() => {
//           // Check if we've reached the end of the frames
//           if (currentFrameIndex === frames.length - 1) {
//             clearInterval(animationInterval);
//             setIsAnimating(false); // Stop the animation
//             setCurrentFrameIndex(0); // Reset to the first frame
//           // } else if (currentFrameIndex == 56){
//           //     // setCurrentFrameIndex(67);
//           //     counter+=1;
//           }
//           else {
//             if (currentFrameIndex === 45){
//               onAnimate();
//             }
//             setCurrentFrameIndex((prevIndex) => prevIndex + 1);
//           }
//         }, 83); // Adjust the delay between frames as needed
//       }
//       // counter = 0;
//       return () => {
//         if (animationInterval) clearInterval(animationInterval); // Clean up the interval
//       };
//     }, [isAnimating, currentFrameIndex]);
  
//     return (
//       <img
//         id="animation_frame"
//         src={frames[currentFrameIndex]}
//         alt={`Frame ${currentFrameIndex + 1}`}
//         onClick={handleImageClick}
//       />
//     );
//   }
  
  // export default AnimationRenderer;

import { useState } from 'react';

function AnimationRenderer({ onAnimate, staticSrc, gifSrc, animationDuration }) {
    const [imageSrc, setImageSrc] = useState(staticSrc);

    const handleImageClick = () => {

        setImageSrc(gifSrc); // Switch to the GIF

        setTimeout(() =>{
            onAnimate();
        }, 4750)

        // onAnimate(); // Call any additional functions

        // Set a timeout to switch back to the static image after the GIF's duration
        setTimeout(() => {
            setImageSrc(staticSrc); // Switch back to the static image
        }, animationDuration);
    };

    return (
        <img
          id="animation_frame"
            src={imageSrc}
            alt="Animation"
            onClick={handleImageClick}
            style={{ cursor: 'pointer' }}
        />
    );
}

export default AnimationRenderer;