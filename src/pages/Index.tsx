import { useGameState } from '@/hooks/useGameState';
import { WelcomeScreen } from '@/components/game/WelcomeScreen';
import { LobbyScreen } from '@/components/game/LobbyScreen';
import { WarningOverlay } from '@/components/game/WarningOverlay';
import { GameScreen } from '@/components/game/GameScreen';
import { GameOverScreen } from '@/components/game/GameOverScreen';

export default function Index() {
  const { state, authenticate, selectStack, daubNumber, claimBingo, returnToLobby } = useGameState();

  switch (state.phase) {
    case 'welcome':
      return <WelcomeScreen onAuthenticate={authenticate} />;
    case 'lobby':
      return (
        <LobbyScreen
          timer={state.timer}
          selectedStack={state.selectedStack}
          occupiedStacks={state.occupiedStacks}
          stats={state.stats}
          onSelect={selectStack}
        />
      );
    case 'warning':
      return (
        <>
          <LobbyScreen
            timer={state.timer}
            selectedStack={state.selectedStack}
            occupiedStacks={state.occupiedStacks}
            stats={state.stats}
            onSelect={selectStack}
          />
          <WarningOverlay timer={state.timer} />
        </>
      );
    case 'game':
      return (
        <GameScreen
          state={state}
          onDaub={daubNumber}
          onClaim={claimBingo}
          onClose={returnToLobby}
        />
      );
    case 'gameover':
      return (
        <GameOverScreen
          winner={state.winner}
          card={state.bingoCard}
          daubedNumbers={state.daubedNumbers}
          stats={state.stats}
          onReturn={returnToLobby}
        />
      );
  }
}
