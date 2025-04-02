<template>
  <div>
    <b-modal
      ref="confirmModal"
      :title="title"
      :ok-title="okTitle"
      :cancel-title="cancelTitle"
      @ok="confirm"
      @cancel="cancel"
      @hidden="hide"
    >
      <p>{{ message }}</p>
    </b-modal>
  </div>
</template>

<script>
export default {
  name: 'ConfirmationModal',
  props: {
    title: {
      type: String,
      default: 'Confirm'
    },
    message: {
      type: String,
      default: 'Are you sure?'
    },
    okTitle: {
      type: String,
      default: 'OK'
    },
    cancelTitle: {
      type: String,
      default: 'Cancel'
    }
  },
  emits: ['confirmed', 'cancelled', 'closed'],
  data() {
    return {
      resolvePromise: null
    };
  },
  methods: {
    show() {
      this.$refs.confirmModal.show();
      return new Promise((resolve) => {
        this.resolvePromise = resolve;
      });
    },
    confirm() {
      if (this.resolvePromise) {
        this.resolvePromise(true);
        this.resolvePromise = null;
      }
      this.$emit('confirmed');
    },
    cancel() {
      if (this.resolvePromise) {
        this.resolvePromise(false);
        this.resolvePromise = null;
      }
      this.$emit('cancelled');
    },
    hide() {
      if (this.resolvePromise) {
        this.resolvePromise(false);
        this.resolvePromise = null;
      }
      this.$emit('closed');
    }
  }
};
</script>