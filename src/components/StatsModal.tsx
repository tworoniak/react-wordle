import type { Stats } from '../game/types';

export function StatsModal({
  open,
  onClose,
  stats,
}: {
  open: boolean;
  onClose: () => void;
  stats: Stats;
}) {
  if (!open) return null;

  const winPct = stats.played
    ? Math.round((stats.wins / stats.played) * 100)
    : 0;

  return (
    <div className='modal' role='dialog' aria-modal='true' aria-label='Stats'>
      <button
        className='modal__backdrop'
        onClick={onClose}
        aria-label='Close stats'
      />

      <div className='modal__panel'>
        <div className='modal__header'>
          <h2 className='modal__title'>Stats</h2>
          <button
            type='button'
            className='modal__close'
            onClick={onClose}
            aria-label='Close'
          >
            ✕
          </button>
        </div>

        <div className='stats-grid'>
          <div className='stats-card'>
            <div className='stats-card__value'>{stats.played}</div>
            <div className='stats-card__label'>Played</div>
          </div>

          <div className='stats-card'>
            <div className='stats-card__value'>{stats.wins}</div>
            <div className='stats-card__label'>Wins</div>
          </div>

          <div className='stats-card'>
            <div className='stats-card__value'>{winPct}%</div>
            <div className='stats-card__label'>Win %</div>
          </div>

          <div className='stats-card'>
            <div className='stats-card__value'>{stats.currentStreak}</div>
            <div className='stats-card__label'>Streak</div>
          </div>

          <div className='stats-card'>
            <div className='stats-card__value'>{stats.maxStreak}</div>
            <div className='stats-card__label'>Best</div>
          </div>
        </div>

        {stats.lastPlayedDayId && (
          <p className='modal__meta'>
            Last played: <strong>{stats.lastPlayedDayId}</strong> (
            {stats.lastResult ?? '—'})
          </p>
        )}
      </div>
    </div>
  );
}
