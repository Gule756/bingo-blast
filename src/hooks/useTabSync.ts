import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Cross-tab player synchronization using BroadcastChannel API.
 * Syncs: player count, stack selections across tabs.
 */

interface TabMessage {
  type: 'JOIN' | 'LEAVE' | 'PING' | 'PONG' | 'STACK_SELECT' | 'STACK_DESELECT';
  tabId: string;
  playerName?: string;
  isPlayer?: boolean;
  stackId?: number;
  timestamp: number;
}

const CHANNEL_NAME = 'habesha-bingo-sync';
const HEARTBEAT_INTERVAL = 2000;
const STALE_TIMEOUT = 5000;

export function useTabSync(playerName: string, isInGame: boolean) {
  const tabId = useRef(`tab_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`);
  const [activeTabs, setActiveTabs] = useState<Map<string, { name: string; isPlayer: boolean; lastSeen: number; stackId: number | null }>>(new Map());
  const channelRef = useRef<BroadcastChannel | null>(null);
  const currentStackRef = useRef<number | null>(null);

  const broadcast = useCallback((msg: Omit<TabMessage, 'tabId' | 'timestamp'>) => {
    try {
      channelRef.current?.postMessage({
        ...msg,
        tabId: tabId.current,
        timestamp: Date.now(),
      });
    } catch {
      // BroadcastChannel may not be available
    }
  }, []);

  // Broadcast stack selection to other tabs
  const broadcastStackSelect = useCallback((stackId: number | null) => {
    if (currentStackRef.current !== null) {
      broadcast({ type: 'STACK_DESELECT', stackId: currentStackRef.current });
    }
    currentStackRef.current = stackId;
    if (stackId !== null) {
      broadcast({ type: 'STACK_SELECT', stackId, playerName });
    }
  }, [broadcast, playerName]);

  useEffect(() => {
    try {
      const channel = new BroadcastChannel(CHANNEL_NAME);
      channelRef.current = channel;

      channel.onmessage = (event: MessageEvent<TabMessage>) => {
        const msg = event.data;
        if (!msg || !msg.tabId || msg.tabId === tabId.current) return;

        setActiveTabs(prev => {
          const next = new Map(prev);
          const existing = next.get(msg.tabId);

          switch (msg.type) {
            case 'JOIN':
            case 'PONG':
              next.set(msg.tabId, {
                name: msg.playerName || 'Unknown',
                isPlayer: msg.isPlayer || false,
                lastSeen: Date.now(),
                stackId: existing?.stackId ?? null,
              });
              break;
            case 'LEAVE':
              next.delete(msg.tabId);
              break;
            case 'PING':
              broadcast({ type: 'PONG', playerName, isPlayer: isInGame });
              next.set(msg.tabId, {
                name: msg.playerName || 'Unknown',
                isPlayer: msg.isPlayer || false,
                lastSeen: Date.now(),
                stackId: existing?.stackId ?? null,
              });
              break;
            case 'STACK_SELECT':
              if (existing) {
                existing.stackId = msg.stackId ?? null;
                existing.lastSeen = Date.now();
              } else {
                next.set(msg.tabId, {
                  name: msg.playerName || 'Unknown',
                  isPlayer: false,
                  lastSeen: Date.now(),
                  stackId: msg.stackId ?? null,
                });
              }
              break;
            case 'STACK_DESELECT':
              if (existing) {
                existing.stackId = null;
                existing.lastSeen = Date.now();
              }
              break;
          }
          return next;
        });
      };

      // Announce self
      broadcast({ type: 'JOIN', playerName, isPlayer: isInGame });
      broadcast({ type: 'PING', playerName, isPlayer: isInGame });

      // Heartbeat
      const heartbeat = setInterval(() => {
        broadcast({ type: 'PING', playerName, isPlayer: isInGame });
        setActiveTabs(prev => {
          const next = new Map(prev);
          const now = Date.now();
          for (const [id, info] of next) {
            if (now - info.lastSeen > STALE_TIMEOUT) next.delete(id);
          }
          return next;
        });
      }, HEARTBEAT_INTERVAL);

      return () => {
        broadcast({ type: 'LEAVE' });
        if (currentStackRef.current !== null) {
          broadcast({ type: 'STACK_DESELECT', stackId: currentStackRef.current });
        }
        clearInterval(heartbeat);
        channel.close();
        channelRef.current = null;
      };
    } catch {
      return undefined;
    }
  }, [playerName, isInGame, broadcast]);

  // Occupied stacks from OTHER tabs
  const occupiedByOthers = new Set<number>();
  for (const [, info] of activeTabs) {
    if (info.stackId !== null) occupiedByOthers.add(info.stackId);
  }

  const totalPlayers = activeTabs.size + 1;

  return { totalPlayers, occupiedByOthers, broadcastStackSelect, tabId: tabId.current };
}
