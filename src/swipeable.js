// Constants
const EVENT_HANDLER_OPTS = { passive: true },
 SWIPE_THRESHOLD = 100; // Minumum distance to consider a successful swipe

/**
 * Configures event listeners to allow for an element to fire a callback when it is horizontally swiped.
 * @param {Element} element - The element to add the event listeners to
 * @param {function} callback - The function to call once the element has been swiped
 * @returns {void}
 */
export function makeSwipeable(element, callback) {
  let touchX;

  element.addEventListener(
    "dragstart",
    (event) => {
      touchX = event.clientX;
      event.dataTransfer.setDragImage(new Image(), 0, 0);
    },
    EVENT_HANDLER_OPTS
  );
  element.addEventListener(
    "touchstart",
    (event) => {
      touchX = event.touches[0].clientX;
    },
    EVENT_HANDLER_OPTS
  );

  element.addEventListener(
    "dragover",
    (event) => {
      const swipeLength = -1 * (touchX - event.clientX);

      element.style.transform = `translateX(${swipeLength}px)`;
    },
    EVENT_HANDLER_OPTS
  );
  element.addEventListener(
    "touchmove",
    (event) => {
      const swipeLength = -1 * (touchX - event.touches[0].clientX);

      element.style.transform = `translateX(${swipeLength}px)`;
    },
    EVENT_HANDLER_OPTS
  );

  element.addEventListener(
    "dragend",
    (event) => {
      const swipeLength = -1 * (touchX - event.clientX);

      if (Math.abs(swipeLength) > SWIPE_THRESHOLD) {
        callback();
      } else {
        element.style.transform = `translateX(0px)`;
      }
    },
    EVENT_HANDLER_OPTS
  );
  element.addEventListener(
    "touchend",
    (event) => {
      const swipeLength = -1 * (touchX - event.changedTouches[0].clientX);

      if (Math.abs(swipeLength) > SWIPE_THRESHOLD) {
        callback();
      } else {
        element.style.transform = `translateX(0px)`;
      }
    },
    EVENT_HANDLER_OPTS
  );
}
