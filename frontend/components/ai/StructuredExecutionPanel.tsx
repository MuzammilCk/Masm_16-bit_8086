"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExecutionInfo } from "@/types/ai-response";
import { Button } from "@/components/ui/button";
import { 
  ChevronLeft, 
  ChevronRight, 
  SkipBack, 
  SkipForward,
  Play,
  Pause
} from "lucide-react";

interface StructuredExecutionPanelProps {
  execution: ExecutionInfo;
}

export function StructuredExecutionPanel({ execution }: StructuredExecutionPanelProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  if (!execution || execution.status !== 'completed') {
    return (
      <div className="p-4 text-muted-foreground text-sm">
        No execution data available
      </div>
    );
  }

  const step = execution.steps[currentStep];
  const progress = ((currentStep + 1) / execution.totalSteps) * 100;

  const handleNext = () => {
    if (currentStep < execution.totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFirst = () => setCurrentStep(0);
  const handleLast = () => setCurrentStep(execution.totalSteps - 1);

  return (
    <div className="p-4 space-y-4">
      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            Step {currentStep + 1} of {execution.totalSteps}
          </span>
          <span className="text-muted-foreground">
            {Math.round(progress)}%
          </span>
        </div>
        <div className="h-2 bg-secondary rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-primary"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-2">
        <Button
          size="icon"
          variant="outline"
          onClick={handleFirst}
          disabled={currentStep === 0}
          title="First step"
        >
          <SkipBack className="h-4 w-4" />
        </Button>
        
        <Button
          size="icon"
          variant="outline"
          onClick={handlePrev}
          disabled={currentStep === 0}
          title="Previous step"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <Button
          size="icon"
          variant="outline"
          onClick={() => setIsPlaying(!isPlaying)}
          title={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </Button>

        <Button
          size="icon"
          variant="outline"
          onClick={handleNext}
          disabled={currentStep === execution.totalSteps - 1}
          title="Next step"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>

        <Button
          size="icon"
          variant="outline"
          onClick={handleLast}
          disabled={currentStep === execution.totalSteps - 1}
          title="Last step"
        >
          <SkipForward className="h-4 w-4" />
        </Button>
      </div>

      {/* Current Instruction */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
          className="p-4 bg-card border border-border rounded-lg shadow-sm"
        >
          <div className="space-y-3">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div>
                <span className="text-muted-foreground text-xs">
                  Line {step.line}
                </span>
                <p className="text-lg font-mono text-foreground mt-1">
                  {step.instruction}
                </p>
              </div>
              <span className="px-2 py-1 bg-primary/20 text-primary text-xs rounded-md font-medium">
                #{step.stepNumber}
              </span>
            </div>

            {/* Description */}
            <div className="flex items-start gap-2 p-3 bg-secondary/50 rounded-md">
              <span className="text-lg">💡</span>
              <p className="text-sm text-foreground flex-1">
                {step.description}
              </p>
            </div>

            {/* Register Changes */}
            {step.registerChanges.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground uppercase font-semibold">
                  Register Changes
                </p>
                <div className="space-y-2">
                  {step.registerChanges.map((change, idx) => (
                    <motion.div
                      key={`${change.register}-${idx}`}
                      initial={{ scale: 1 }}
                      animate={{ 
                        scale: change.highlight ? [1, 1.05, 1] : 1,
                      }}
                      transition={{ duration: 0.5 }}
                      className="flex items-center gap-3 font-mono text-sm p-2 bg-secondary/30 rounded"
                    >
                      <span className="text-muted-foreground font-semibold min-w-[3rem]">
                        {change.register}:
                      </span>
                      <span className="text-muted-foreground/70">
                        {change.before}
                      </span>
                      <span className="text-muted-foreground">→</span>
                      <span className="text-green-500 font-bold">
                        {change.after}
                      </span>
                      {change.highlight && (
                        <motion.span 
                          className="text-yellow-500"
                          animate={{ rotate: [0, 10, -10, 0] }}
                          transition={{ duration: 0.5 }}
                        >
                          ✨
                        </motion.span>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Flag Changes */}
            {step.flagChanges && step.flagChanges.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground uppercase font-semibold">
                  Flag Changes
                </p>
                <div className="flex flex-wrap gap-2">
                  {step.flagChanges.map((change, idx) => (
                    <div
                      key={`${change.flag}-${idx}`}
                      className="px-3 py-1 bg-secondary rounded-md font-mono text-xs"
                    >
                      <span className="text-muted-foreground">{change.flag}:</span>
                      <span className="ml-2 text-muted-foreground/70">{change.before}</span>
                      <span className="mx-1 text-muted-foreground">→</span>
                      <span className="text-blue-500 font-bold">{change.after}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Memory Changes */}
            {step.memoryChanges && step.memoryChanges.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground uppercase font-semibold">
                  Memory Changes
                </p>
                <div className="space-y-2">
                  {step.memoryChanges.map((change, idx) => (
                    <div
                      key={`${change.address}-${idx}`}
                      className="flex items-center gap-3 font-mono text-sm p-2 bg-secondary/30 rounded"
                    >
                      <span className="text-muted-foreground font-semibold">
                        {change.address}
                        {change.label && (
                          <span className="text-primary ml-2">({change.label})</span>
                        )}:
                      </span>
                      <span className="text-muted-foreground/70">{change.before}</span>
                      <span className="text-muted-foreground">→</span>
                      <span className="text-orange-500 font-bold">{change.after}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Final State (when at last step) */}
      {currentStep === execution.totalSteps - 1 && execution.finalState && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg"
        >
          <h3 className="text-green-500 font-semibold mb-3 flex items-center gap-2">
            <span className="text-xl">✅</span>
            Execution Complete
          </h3>
          
          {execution.finalState.result && (
            <p className="text-foreground mb-4 font-medium">
              🎯 Result: {execution.finalState.result.description}
            </p>
          )}

          {execution.performance && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
              <div className="p-3 bg-card rounded-md">
                <p className="text-muted-foreground text-xs">Instructions</p>
                <p className="text-foreground font-mono font-semibold mt-1">
                  {execution.performance.instructions}
                </p>
              </div>
              <div className="p-3 bg-card rounded-md">
                <p className="text-muted-foreground text-xs">Cycles</p>
                <p className="text-foreground font-mono font-semibold mt-1">
                  {execution.performance.cycles}
                </p>
              </div>
              <div className="p-3 bg-card rounded-md">
                <p className="text-muted-foreground text-xs">Time</p>
                <p className="text-foreground font-mono font-semibold mt-1">
                  {execution.performance.time}
                </p>
              </div>
              <div className="p-3 bg-card rounded-md">
                <p className="text-muted-foreground text-xs">Efficiency</p>
                <p className="text-foreground font-mono font-semibold mt-1">
                  {execution.performance.efficiency}%
                </p>
              </div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
