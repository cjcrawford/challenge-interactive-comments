<template>
  <nav>
    <button
      :disabled="
        !isLoggedIn || isCurrentUserComment || userVoteScore === 1 || isLoading
      "
      type="button"
      class="button button--plus"
      aria-labelledby="up vote"
      @click="handleVote(1)"
    >
      <svg viewbox="0 0 11 11" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M6.33 10.896c.137 0 .255-.05.354-.149.1-.1.149-.217.149-.354V7.004h3.315c.136 0 .254-.05.354-.149.099-.1.148-.217.148-.354V5.272a.483.483 0 0 0-.148-.354.483.483 0 0 0-.354-.149H6.833V1.4a.483.483 0 0 0-.149-.354.483.483 0 0 0-.354-.149H4.915a.483.483 0 0 0-.354.149c-.1.1-.149.217-.149.354v3.37H1.08a.483.483 0 0 0-.354.15c-.1.099-.149.217-.149.353v1.23c0 .136.05.254.149.353.1.1.217.149.354.149h3.333v3.39c0 .136.05.254.15.353.098.1.216.149.353.149H6.33Z"
        />
      </svg>
    </button>
    {{ comment.score }}
    <button
      :disabled="
        !isLoggedIn || isCurrentUserComment || userVoteScore === -1 || isLoading
      "
      type="button"
      class="button button--minus"
      aria-labelledby="down vote"
      @click="handleVote(-1)"
    >
      <svg class="minus" viewbox="0 0 11 5" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M9.256 2.66c.204 0 .38-.056.53-.167.148-.11.222-.243.222-.396V.722c0-.152-.074-.284-.223-.395a.859.859 0 0 0-.53-.167H.76a.859.859 0 0 0-.53.167C.083.437.009.57.009.722v1.375c0 .153.074.285.223.396a.859.859 0 0 0 .53.167h8.495Z"
        />
      </svg>
    </button>
  </nav>
</template>

<script>
import { ref, computed } from "vue";
import { isLoggedIn, user } from "../services/useAuth.js";
import { vote } from "../services/useComments.js";

export default {
  props: {
    comment: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const error = ref();
    const isLoading = ref(false);
    const isCurrentUserComment = computed(
      () => user.username === props.comment.user.username
    );

    const userVoteScore = computed(() => user.commentVotes[props.comment.id]);

    const handleVote = async (score) => {
      isLoading.value = true;
      try {
        await vote(props.comment, score);
      } catch (e) {
        error.value = e;
      } finally {
        isLoading.value = false;
      }
    };

    return {
      user,
      isCurrentUserComment,
      isLoggedIn,
      isLoading,
      userVoteScore,
      handleVote,
    };
  },
};
</script>

<style scoped>
button {
  color: var(--theme-moderate-blue);
  padding: 15px;
  display: inline-flex;
  justify-content: center;
  border-radius: 10px;
}

button:disabled {
  color: var(--theme-light-gray-blue);
}

.button--plus svg {
  width: 11px;
  height: 11px;
}

.button--minus svg {
  width: 11px;
  height: 5px;
}
</style>
