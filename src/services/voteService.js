import IsDeletedError from '../errors/IsdeletedError.js';
import * as voteRepository from '../repositories/voteRepository.js';
import * as recommendationService from './recommendationService.js';

async function addUpVote({ recommendationId }) {
  const checkUnavailability = await recommendationService.isDeleted({
    recommendationId,
  });

  if (checkUnavailability) {
    throw new IsDeletedError('Recomendação não encontrada.');
  }

  const vote = await voteRepository.createVote({
    recommendationId,
    type: 'upvote',
  });

  return vote;
}

async function addDownVote({ recommendationId }) {
  const isDeleted = await recommendationService.isDeleted({ recommendationId });

  if (isDeleted) {
    throw new IsDeletedError('Recomendação não encontrada.');
  }

  const downVotesAmount = await voteRepository.findDownVotes({
    recommendationId,
  });

  if (downVotesAmount === 5) {
    await recommendationService.removeRecommendation({
      recommendationId,
    });
    return [];
  }

  const vote = await voteRepository.createVote({
    recommendationId,
    type: 'downvote',
  });

  return vote;
}

export { addUpVote, addDownVote };
