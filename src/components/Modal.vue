<template>
  <Transition name="modal">
    <div v-if="show" class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container">
          <div class="modal-header">
            <slot name="header"></slot>
          </div>

          <div class="modal-body">
            <slot name="body"></slot>
          </div>

          <div class="modal-footer">
            <slot name="footer"></slot>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script>
import { watch } from "vue";

export default {
  name: "Modal",

  props: {
    show: Boolean,
  },

  setup(props) {
    // disable background scrolling when modal is shown
    watch(
      () => props.show,
      (value) => {
        if (value) {
          document.querySelector("body").classList.add("modal--active");
        } else {
          document.querySelector("body").classList.remove("modal--active");
        }
      }
    );
  },
};
</script>

<style>
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: table;
  transition: opacity 0.3s ease;
}

.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}

.modal-container {
  width: 343px;
  margin: 0px auto;
  padding: 24px 27px;
  background-color: var(--theme-white);
  border-radius: 8px;
  transition: all 0.3s ease;
}

.modal-header h3 {
  margin: 0;
  font-size: 20px;
  color: var(--theme-dark-blue);
}

.modal-body {
  margin: 16px 0;
}

.modal-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.modal-footer .button {
  text-align: center;
}

.modal-footer > .button + .button {
  margin-left: 12px;
}

.modal-footer .button--rounded {
  padding: 12px 18px;
}

/* Vue transition magic classes for transition="modal" */
.modal-enter-from {
  opacity: 0;
}

.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}

.modal--active {
  overflow: hidden !important;
}

@media (min-width: 768px) {
  .modal-container {
    width: 400px;
    margin: 0px auto;
    padding: 32px 32px;
    background-color: var(--theme-white);
    border-radius: 8px;
    transition: all 0.3s ease;
  }

  .modal-header h3 {
    font-size: 24px;
  }

  .modal-footer .button--rounded {
    padding: 12px 30px;
  }
}
</style>
