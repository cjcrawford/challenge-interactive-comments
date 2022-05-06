<template>
  <TransitionGroup name="fade" tag="section" class="comments-container">
    <CommentDisplay
      v-for="comment in comments"
      :key="comment.id"
      :comment="comment"
    >
      <template #replies>
        <TransitionGroup
          v-if="comment.replies?.length"
          name="fade"
          tag="section"
          class="comment__replies"
        >
          <CommentDisplay
            v-for="reply in comment.replies"
            :key="`comment:${comment.id}:${reply.id}`"
            :comment="reply"
            :parent="comment"
          />
        </TransitionGroup>
      </template>
    </CommentDisplay>
  </TransitionGroup>

  <CommentForm class="comments-container" />
</template>

<script>
import { currentUser } from "./data.json";
import { comments } from "./services/useComments.js";
import CommentDisplay from "./components/CommentDisplay.vue";
import CommentForm from "./components/CommentForm.vue";

export default {
  name: "App",

  components: {
    CommentDisplay,
    CommentForm,
  },

  setup() {
    return {
      comments,
      currentUser,
    };
  },
};
</script>

<style>
#app {
  padding: 32px 16px;
}

.comments-container {
  margin: 0 auto;
  max-width: none;
}

.comment__replies {
  position: relative;
  padding-left: 16px;
}

.comment__replies::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  background-color: var(--theme-light-gray);
  background-repeat: repeat-y;
  width: 2px;
  height: 100%;
  margin-right: 16px;
}

@media (min-width: 768px) {
  #app {
    padding: 64px 32px;
  }

  .comments-container {
    max-width: 730px;
  }

  .comment__replies {
    padding-left: 88px;
  }

  .comment__replies::before {
    left: 43px;
    margin-right: 43px;
  }
}
</style>
