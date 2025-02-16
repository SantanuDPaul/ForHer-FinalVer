let highestZ = 1;

class Paper {
  holdingPaper = false;
  mouseTouchX = 0;
  mouseTouchY = 0;
  mouseX = 0;
  mouseY = 0;
  prevMouseX = 0;
  prevMouseY = 0;
  velX = 0;
  velY = 0;
  rotation = Math.random() * 30 - 15;
  currentPaperX = 0;
  currentPaperY = 0;
  rotating = false;

  init(paper) {
    document.addEventListener('mousemove', (e) => {
      if(!this.rotating) {
        this.mouseX = e.clientX;
        this.mouseY = e.clientY;
        
        this.velX = this.mouseX - this.prevMouseX;
        this.velY = this.mouseY - this.prevMouseY;
      }
        
      const dirX = e.clientX - this.mouseTouchX;
      const dirY = e.clientY - this.mouseTouchY;
      const dirLength = Math.sqrt(dirX*dirX+dirY*dirY);
      const dirNormalizedX = dirX / dirLength;
      const dirNormalizedY = dirY / dirLength;

      const angle = Math.atan2(dirNormalizedY, dirNormalizedX);
      let degrees = 180 * angle / Math.PI;
      degrees = (360 + Math.round(degrees)) % 360;
      if(this.rotating) {
        this.rotation = degrees;
      }

      if(this.holdingPaper) {
        if(!this.rotating) {
          this.currentPaperX += this.velX;
          this.currentPaperY += this.velY;
        }
        this.prevMouseX = this.mouseX;
        this.prevMouseY = this.mouseY;

        paper.style.transform = `translateX(${this.currentPaperX}px) translateY(${this.currentPaperY}px) rotateZ(${this.rotation}deg)`;
      }
    })

    paper.addEventListener('mousedown', (e) => {
      if(this.holdingPaper) return; 
      this.holdingPaper = true;
      
      paper.style.zIndex = highestZ;
      highestZ += 1;
      
      if(e.button === 0) {
        this.mouseTouchX = this.mouseX;
        this.mouseTouchY = this.mouseY;
        this.prevMouseX = this.mouseX;
        this.prevMouseY = this.mouseY;
      }
      if(e.button === 2) {
        this.rotating = true;
      }
    });
    window.addEventListener('mouseup', () => {
      this.holdingPaper = false;
      this.rotating = false;
    });
  }
}

const papers = Array.from(document.querySelectorAll('.paper'));

papers.forEach(paper => {
  const p = new Paper();
  p.init(paper);
});

// document.addEventListener("DOMContentLoaded", () => {
//   let audio = document.getElementById("bgMusic");

//   // Restore audio state from localStorage
//   if (localStorage.getItem("isPlaying") === "true") {
//       audio.currentTime = localStorage.getItem("audioTime") || 0;
//       audio.play().catch(() => {
//           console.log("Autoplay blocked. Waiting for user interaction.");
//       });
//   }

//   // Save progress before switching pages
//   window.addEventListener("beforeunload", () => {
//       localStorage.setItem("audioTime", audio.currentTime);
//       localStorage.setItem("isPlaying", !audio.paused);
//   });

//   // Fix autoplay issue: Play on user click
//   document.addEventListener("click", () => {
//       if (audio.paused) {
//           audio.play();
//       }
//   });
// });
document.addEventListener("DOMContentLoaded", () => {
  let audio = document.getElementById("bgMusic");

  let playPromise = audio.play();
  
  if (playPromise !== undefined) {
      playPromise.then(() => {
          console.log("Music autoplayed successfully!");
      }).catch(() => {
          console.log("Autoplay blocked. Waiting for user interaction.");
          
          document.addEventListener("click", () => {
              if (audio.paused) {
                  audio.play();
              }
          }, { once: true }); 
      });
  }

 
  if (localStorage.getItem("isPlaying") === "true") {
      audio.currentTime = localStorage.getItem("audioTime") || 0;
      audio.play().catch(() => {
          console.log("Autoplay blocked. User interaction needed.");
      });
  }

 
  window.addEventListener("beforeunload", () => {
      localStorage.setItem("audioTime", audio.currentTime);
      localStorage.setItem("isPlaying", !audio.paused);
  });
});
