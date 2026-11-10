'use strict';
document.querySelectorAll('select[data-video]').forEach(select => {
  select.addEventListener('change', () => {
    const video=select.closest('.demo-card').querySelector('video');
    video.defaultPlaybackRate=Number(select.value);
    video.playbackRate=Number(select.value);
  });
});
document.querySelectorAll('video').forEach(video => {
  video.defaultPlaybackRate = 1;
  video.addEventListener('play', () => {
    const pair = video.closest('[data-play-together]');
    document.querySelectorAll('video').forEach(other => {
      if (other !== video && !other.paused && (!pair || other.closest('[data-play-together]') !== pair)) other.pause();
    });
  });
});
document.querySelectorAll('.pair-play').forEach(button => {
  button.addEventListener('click', async () => {
    const pair=button.closest('[data-play-together]');
    pair.querySelectorAll('select').forEach(select => { select.value='1'; });
    try {
      await Promise.all([...pair.querySelectorAll('video')].map(video => {
        video.defaultPlaybackRate=1;video.playbackRate=1;video.currentTime=0;return video.play();
      }));
    } catch (_) { button.textContent='Use each video’s play button'; }
  });
});
