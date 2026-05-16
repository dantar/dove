import { defineStore } from 'pinia'
import { reactive, ref } from 'vue';

export class UndoableAction {
  countdown: number;
  constructor(action: () => Promise<void>, cleanupFn?: (u: UndoableAction) => void) {
    this.countdown = 5000;
    this.action = action;
    this.timer = 0;
    this.cleanupFn = cleanupFn;
  }
  text = 'Undo?';
  step = 100;
  timer: number;
  action: () => Promise<void>;
  cleanupFn?: (u: UndoableAction) => void;
  rejectFn?: ((reason?: any) => void);
  resolveFn?: (value: string | PromiseLike<string>) => void;

  static start(u: UndoableAction): Promise<string> {
    return new Promise((resolve, reject) => {
      u.resolveFn = resolve;
      u.rejectFn = reject;
      u.timer = window.setInterval(async () => {
        u.countdown -= u.step;
        if (u.countdown <= 0) {
          UndoableAction.cleanup(u);
          try {
            await u.action();
            resolve('done');
          } catch (e) {
            reject(e);
          }
        }
      }, u.step);
    });
  }

  static abort(u: UndoableAction) {
    if (u.timer !== null) {
      UndoableAction.cleanup(u);
      if (u.resolveFn) {
        u.resolveFn('undone');
      }
    }
  }

  private static cleanup(u: UndoableAction) {
    if (u.timer !== null) {
      clearInterval(u.timer);
    }
    if (u.cleanupFn) {
      u.cleanupFn(u);
    }
  }

}

export const useUndoableActions = defineStore('undoableActions', () => {

  const undoables = ref<UndoableAction[]>([]);

  function newUndoable(action: () => Promise<void>): UndoableAction {
    const undoable = reactive(new UndoableAction(action, (u: UndoableAction) => {
      const index = undoables.value.indexOf(u);
      if (index >= 0) {
        undoables.value.splice(index, 1);
      }
    }));
    undoables.value.push(undoable);
    return undoable;
  }

  return { 
    undoables, newUndoable
  }

})
