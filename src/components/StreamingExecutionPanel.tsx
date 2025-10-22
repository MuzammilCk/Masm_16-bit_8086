'use client';

import { motion, AnimatePresence } from 'framer-motion';

interface StreamingExecutionPanelProps {
  state: any;
  isStreaming: boolean;
}

export function StreamingExecutionPanel({ state, isStreaming }: StreamingExecutionPanelProps) {
  const { status, progress, message, symbols, initialMemory, steps, finalState, finalMemory, summary, error, compilationErrors } = state;

  return (
    <div className="h-full overflow-y-auto bg-[#1e1e1e] text-gray-100 p-4 font-mono text-sm">
      {/* Progress Bar */}
      <div className="mb-4 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-400 capitalize flex items-center gap-2">
            {isStreaming && (
              <span className="inline-block w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
            )}
            {status}
          </span>
          <span className="text-gray-400">{progress}%</span>
        </div>
        <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        {message && (
          <p className="text-xs text-gray-400 italic">{message}</p>
        )}
      </div>

      {/* Status Messages */}
      <AnimatePresence mode="wait">
        {status === 'parsing' && (
          <motion.div
            key="parsing"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg"
          >
            <div className="flex items-center gap-2">
              <span className="text-lg animate-pulse">🔍</span>
              <span className="text-blue-300 font-semibold">Parsing assembly code...</span>
            </div>
          </motion.div>
        )}

        {status === 'building' && (
          <motion.div
            key="building"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg"
          >
            <div className="flex items-center gap-2">
              <span className="text-lg animate-spin">⚙️</span>
              <span className="text-yellow-300 font-semibold">Building symbol table...</span>
            </div>
          </motion.div>
        )}

        {status === 'compiling' && (
          <motion.div
            key="compiling"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-4 p-3 bg-purple-500/10 border border-purple-500/30 rounded-lg"
          >
            <div className="flex items-center gap-2">
              <span className="text-lg animate-bounce">🧠</span>
              <span className="text-purple-300 font-semibold">AI is analyzing code...</span>
            </div>
          </motion.div>
        )}

        {status === 'executing' && (
          <motion.div
            key="executing"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-4 p-3 bg-green-500/10 border border-green-500/30 rounded-lg"
          >
            <div className="flex items-center gap-2">
              <span className="text-lg animate-pulse">▶️</span>
              <span className="text-green-300 font-semibold">
                Executing instructions... ({steps.length} steps)
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Compilation Errors */}
      {compilationErrors.length > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-4 p-4 bg-red-900/20 border border-red-700 rounded-lg"
        >
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">❌</span>
            <h3 className="text-lg font-semibold text-red-400">Compilation Failed</h3>
          </div>
          <div className="space-y-3">
            {compilationErrors.map((err: any, idx: number) => (
              <div key={idx} className="p-3 bg-gray-900/50 rounded border-l-4 border-red-500">
                <p className="text-red-300 font-semibold mb-1">
                  Error {idx + 1}: Line {err.line}, Column {err.column}
                </p>
                <p className="text-gray-300 mb-2">{err.message}</p>
                {err.explanation && (
                  <p className="text-gray-400 text-xs mb-2">
                    <span className="text-blue-400">📖 Why:</span> {err.explanation}
                  </p>
                )}
                {err.suggestion && (
                  <p className="text-gray-400 text-xs">
                    <span className="text-green-400">💡 Fix:</span> {err.suggestion}
                  </p>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Symbol Table */}
      {symbols.length > 0 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mb-4"
        >
          <h3 className="text-sm font-semibold text-gray-300 mb-2 flex items-center gap-2">
            <span>📊</span> Symbol Table
          </h3>
          <div className="bg-gray-900/50 rounded-lg p-3 space-y-1 border border-gray-700">
            {symbols.map((symbol: any, i: number) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center justify-between text-xs py-1"
              >
                <span className="text-purple-400 font-semibold">{symbol.label}</span>
                <span className="text-gray-500">{symbol.segment}</span>
                <span className="text-blue-400">{symbol.type}</span>
                <span className="text-gray-400">{symbol.size}</span>
                <span className="text-green-400">{symbol.value}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Initial Memory */}
      {initialMemory.length > 0 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mb-4"
        >
          <h3 className="text-sm font-semibold text-gray-300 mb-2 flex items-center gap-2">
            <span>💾</span> Initial Memory Layout
          </h3>
          <div className="bg-gray-900/50 rounded-lg p-3 space-y-1 border border-gray-700 max-h-40 overflow-y-auto">
            {initialMemory.map((mem: any, i: number) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
                className="flex items-center justify-between text-xs py-1"
              >
                <span className="text-blue-400 font-mono">{mem.offset}</span>
                <span className="text-green-400 font-mono">{mem.value}</span>
                <span className="text-gray-400">{mem.symbol}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Execution Steps */}
      {steps.length > 0 && (
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-gray-300 mb-2 flex items-center gap-2">
            <span>🎯</span> Execution Steps ({steps.length})
          </h3>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            <AnimatePresence>
              {steps.map((step: any, i: number) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2 }}
                  className="p-3 bg-gray-900/70 rounded-lg border border-gray-700 hover:border-blue-500/50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-xs text-gray-500 font-semibold">
                      Step {step.step}
                    </span>
                  </div>
                  <p className="font-mono text-sm text-white mb-2">
                    {step.instruction}
                  </p>
                  <p className="text-xs text-gray-400 mb-2">
                    → {step.description}
                  </p>
                  {step.registers && Object.keys(step.registers).length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(step.registers).map(([reg, val]: any, j: number) => (
                        <span
                          key={j}
                          className="px-2 py-1 bg-green-500/20 text-green-300 text-xs rounded font-mono border border-green-500/30"
                        >
                          {reg}={val}
                        </span>
                      ))}
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Final State */}
      {status === 'complete' && finalState && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-4 p-4 bg-green-900/20 border border-green-700 rounded-lg"
        >
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">✅</span>
            <h3 className="text-lg font-semibold text-green-300">Execution Complete!</h3>
          </div>
          {summary && (
            <p className="text-gray-300 mb-3 text-sm">{summary}</p>
          )}
          
          {/* Final Registers */}
          {finalState.registers && (
            <div className="mb-3">
              <h4 className="text-xs font-semibold text-gray-400 mb-2">Final Registers:</h4>
              <div className="grid grid-cols-4 gap-2">
                {Object.entries(finalState.registers).map(([reg, val]: any) => (
                  <div key={reg} className="bg-gray-900/50 rounded px-2 py-1 border border-gray-700">
                    <span className="text-blue-400 text-xs font-mono">{reg}:</span>
                    <span className="text-green-300 text-xs font-mono ml-1">{val}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Final Flags */}
          {finalState.flags && (
            <div>
              <h4 className="text-xs font-semibold text-gray-400 mb-2">Flags:</h4>
              <div className="flex flex-wrap gap-2">
                {Object.entries(finalState.flags).map(([flag, val]: any) => (
                  <span
                    key={flag}
                    className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded font-mono border border-purple-500/30"
                  >
                    {flag}={val}
                  </span>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* Final Memory */}
      {finalMemory.length > 0 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mb-4"
        >
          <h3 className="text-sm font-semibold text-gray-300 mb-2 flex items-center gap-2">
            <span>💾</span> Final Memory State
          </h3>
          <div className="bg-gray-900/50 rounded-lg p-3 space-y-1 border border-gray-700 max-h-40 overflow-y-auto">
            {finalMemory.map((mem: any, i: number) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
                className="flex items-center justify-between text-xs py-1"
              >
                <span className="text-blue-400 font-mono">{mem.offset}</span>
                <span className="text-yellow-400 font-mono">{mem.value}</span>
                <span className="text-gray-400">{mem.symbol}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Error State */}
      {status === 'error' && error && compilationErrors.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-4 bg-red-900/20 border border-red-700 rounded-lg"
        >
          <div className="flex items-center gap-2">
            <span className="text-xl">❌</span>
            <div>
              <h3 className="text-red-400 font-semibold">Error</h3>
              <p className="text-gray-300 text-sm">{error}</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Idle State */}
      {status === 'idle' && (
        <div className="flex flex-col items-center justify-center h-64 text-gray-500">
          <span className="text-4xl mb-3">🚀</span>
          <p className="text-sm">Click "Run" to execute your assembly code</p>
          <p className="text-xs mt-2">Live execution with real-time feedback</p>
        </div>
      )}
    </div>
  );
}
