'use client';

import React, { useState, useEffect } from 'react';
import { useToast } from '@/components/Toast';
import { StudyPlannerHero } from './StudyPlannerHero';
import { TodaysPlanCard } from './TodaysPlanCard';
import { WeeklyScheduleCard } from './WeeklyScheduleCard';
import { RecommendedSection } from './RecommendedSection';
import { StudyGoalsCard } from './StudyGoalsCard';
import { PopularSubjectsCard } from './PopularSubjectsCard';
import { MotivationCard } from './MotivationCard';
import { StudyStreakCard } from './StudyStreakCard';
import { AddTaskModal } from './AddTaskModal';
import { CreateGoalModal } from './CreateGoalModal';
import { AiPlanGeneratorModal } from './AiPlanGeneratorModal';
import { DeleteTaskModal } from './DeleteTaskModal';
import { StudyTask, StudyGoal, RecommendedItem } from '@/types/study-planner';

const getWeekMonday = (base = new Date()) => {
  const d = new Date(base);
  d.setHours(12, 0, 0, 0);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  return d;
};

const getWeekDate = (offset: number, base = new Date()) => {
  const d = getWeekMonday(base);
  d.setDate(d.getDate() + offset);
  return d.toISOString().slice(0, 10);
};

const formatLongDate = (dateStr: string) =>
  new Intl.DateTimeFormat('en-US', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })
    .format(new Date(`${dateStr}T12:00:00`));

const normalizePlannerTasks = (items: StudyTask[]) => items.map((t) => {
  const legacyMatch = /^task-/.test(t.id) && typeof t.date === 'string' && t.date.startsWith('2025-');
  const dayMatch = typeof t.date === 'string' ? /^Day (\d+)$/.exec(t.date) : null;
  if (legacyMatch) {
    const legacyDates: Record<string, number> = { '2025-08-26': 0, '2025-08-27': 1, '2025-08-28': 2, '2025-08-29': 3, '2025-08-30': 4, '2025-08-31': 5, '2025-09-01': 6 };
    const offset = legacyDates[t.date!];
    if (offset !== undefined) return { ...t, date: getWeekDate(offset) };
  }
  if (dayMatch) {
    const offset = Math.max(0, Number(dayMatch[1]) - 1);
    return { ...t, date: getWeekDate(offset) };
  }
  return t;
});

interface StudyPlannerWorkspaceProps {
  onNavigateAiTutor?: (prompt?: string) => void;
  onNavigateProgress?: () => void;
}

const DEFAULT_TASKS: StudyTask[] = [];

const DEFAULT_GOALS: StudyGoal[] = [];

export const StudyPlannerWorkspace: React.FC<StudyPlannerWorkspaceProps> = ({
  onNavigateAiTutor,
  onNavigateProgress,
}) => {
  const { showToast } = useToast();
  const [mobilePlannerTab, setMobilePlannerTab] = useState<'schedule' | 'goals'>('schedule');

  // Safe localStorage helper with schema validation
  const [tasks, setTasks] = useState<StudyTask[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('study_planner_tasks');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            const demoIds = new Set(['task-math-1', 'task-phys-1', 'task-eng-1', 'task-chem-1', 'task-tue-1', 'task-tue-2', 'task-tue-3', 'task-wed-1', 'task-wed-2', 'task-wed-3', 'task-thu-1', 'task-thu-2', 'task-thu-3', 'task-fri-1', 'task-fri-2', 'task-sat-1', 'task-sat-2', 'task-sun-1']);
            const clean = parsed.filter((task: StudyTask) => !demoIds.has(task?.id));
            if (clean.length !== parsed.length) localStorage.setItem('study_planner_tasks', JSON.stringify(clean));
            // Verify each item has minimal required shape
            const valid = clean.every((t) => t && typeof t.id === 'string' && typeof t.subject === 'string');
            if (valid) return normalizePlannerTasks(clean);
          }
        }
      } catch {
        // ignore JSON parse or corrupt data
      }
    }
    return DEFAULT_TASKS;
  });

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTasks((current) => { const normalized = normalizePlannerTasks(current); try { localStorage.setItem('study_planner_tasks', JSON.stringify(normalized)); } catch {} return normalized; });
  }, []);

  const [goals, setGoals] = useState<StudyGoal[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('study_planner_goals');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            const demoIds = new Set(['goal-1', 'goal-2', 'goal-3', 'goal-4']);
            const clean = parsed.filter((goal: StudyGoal) => !demoIds.has(goal?.id));
            if (clean.length !== parsed.length) localStorage.setItem('study_planner_goals', JSON.stringify(clean));
            const valid = clean.every((g) => g && typeof g.id === 'string' && typeof g.title === 'string');
            if (valid) return clean;
          }
        }
      } catch {
        // ignore JSON parse or corrupt data
      }
    }
    return DEFAULT_GOALS;
  });

  const [selectedDate, setSelectedDate] = useState<string>(getWeekDate(0));
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<string | null>(null);

  // Modals state
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [isCreateGoalOpen, setIsCreateGoalOpen] = useState(false);
  const [isAiPlanOpen, setIsAiPlanOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<StudyTask | null>(null);
  const [taskToDelete, setTaskToDelete] = useState<StudyTask | null>(null);

  // Streak days state initialized lazily from localStorage
  const [streakDays, setStreakDays] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      try {
        const storedStreak = localStorage.getItem('study_streak_days');
        if (storedStreak) {
          const num = parseInt(storedStreak, 10);
          if (!isNaN(num) && num >= 0) {
            if (num === 3) { localStorage.removeItem('study_streak_days'); return 0; }
            return num;
          }
        }
      } catch {
        // ignore
      }
    }
    return 0;
  });

  const saveTasks = (newTasks: StudyTask[]) => {
    setTasks(newTasks);
    try {
      localStorage.setItem('study_planner_tasks', JSON.stringify(newTasks));
    } catch {
      // ignore
    }
  };

  const saveGoals = (newGoals: StudyGoal[]) => {
    setGoals(newGoals);
    try {
      localStorage.setItem('study_planner_goals', JSON.stringify(newGoals));
    } catch {
      // ignore
    }
  };

  // Toggle task completion + automatically update connected goal progress
  const handleToggleTask = (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    const nextState = !task.completed;
    const updatedTasks = tasks.map((t) => (t.id === taskId ? { ...t, completed: nextState } : t));
    saveTasks(updatedTasks);

    // Automatically update connected goal progress
    const updatedGoals = goals.map((g) => {
      if (g.subject.toLowerCase() === task.subject.toLowerCase() || task.topic.toLowerCase().includes(g.subject.toLowerCase())) {
        const currentCount = g.completedSessions || 0;
        const newCount = nextState ? currentCount + 1 : Math.max(0, currentCount - 1);
        const target = g.targetSessions || 4;
        const isGoalAchieved = newCount >= target;
        return {
          ...g,
          completedSessions: newCount,
          completed: isGoalAchieved,
        };
      }
      return g;
    });
    saveGoals(updatedGoals);

    // Calculate streak
    if (nextState) {
      const next = streakDays + 1;
      setStreakDays(next);
      try {
        localStorage.setItem('study_streak_days', next.toString());
      } catch {
        // ignore
      }
    }

    showToast(
      nextState
        ? `Completed: ${task.subject} (${task.topic}) 🎉`
        : `Reopened session: ${task.subject}`,
      nextState ? 'success' : 'info'
    );
  };

  // Add new task
  const handleAddTask = (newTask: Omit<StudyTask, 'id' | 'completed'>) => {
    const task: StudyTask = {
      ...newTask,
      id: `task-${Date.now()}`,
      completed: false,
    };
    saveTasks([...tasks, task]);
    showToast('Study task added successfully.', 'success');
  };

  // Edit existing task
  const handleUpdateTask = (updatedTask: StudyTask) => {
    const updated = tasks.map((t) => (t.id === updatedTask.id ? updatedTask : t));
    saveTasks(updated);
    setTaskToEdit(null);
    showToast('Study task updated successfully.', 'success');
  };

  // Delete task confirmation
  const handleConfirmDelete = () => {
    if (!taskToDelete) return;
    const updated = tasks.filter((t) => t.id !== taskToDelete.id);
    saveTasks(updated);
    setTaskToDelete(null);
    showToast('Study task deleted successfully.', 'info');
  };

  // Toggle goal completion manually
  const handleToggleGoal = (goalId: string) => {
    const updated = goals.map((g) => {
      if (g.id === goalId) {
        const nextState = !g.completed;
        showToast(
          nextState
            ? `Goal Achieved: "${g.title}" 🏆`
            : `Goal marked in progress: "${g.title}"`,
          nextState ? 'success' : 'info'
        );
        return {
          ...g,
          completed: nextState,
          completedSessions: nextState ? (g.targetSessions || 4) : 0,
        };
      }
      return g;
    });
    saveGoals(updated);
  };

  // Create new goal
  const handleCreateGoal = (newGoal: Omit<StudyGoal, 'id' | 'completed'>) => {
    const goal: StudyGoal = {
      ...newGoal,
      id: `goal-${Date.now()}`,
      completed: false,
    };
    saveGoals([...goals, goal]);
    showToast('Goal created successfully.', 'success');
  };

  // Add AI generated study plan
  const handleApplyAiPlan = (generatedTasks: StudyTask[]) => {
    saveTasks([...tasks, ...generatedTasks]);
    showToast('Your AI study plan has been added.', 'ai');
  };

  // Handle recommendation action
  const handleSelectRecommendation = (item: RecommendedItem) => {
    if (onNavigateAiTutor) {
      onNavigateAiTutor(`Let's work on ${item.subject}: ${item.title}. Can you explain key concepts and give 3 practice questions?`);
    } else {
      showToast(`Started: ${item.title} (${item.subject})`, 'info');
    }
  };

  // Handle popular subject selection
  const handleSelectPopularSubject = (subjectName: string) => {
    if (selectedSubjectFilter === subjectName) {
      setSelectedSubjectFilter(null);
      showToast(`Cleared ${subjectName} filter`, 'info');
    } else {
      setSelectedSubjectFilter(subjectName);
      showToast(`Filtered sessions for ${subjectName}`, 'info');
    }
  };

  // Tasks for Today's Plan: filtered by selectedDate and optional subject filter
  const todayTasks = tasks.filter((t) => {
    const matchesDate = (t.date || getWeekDate(0)) === selectedDate;
    const matchesSubject = selectedSubjectFilter
      ? t.subject.toLowerCase() === selectedSubjectFilter.toLowerCase()
      : true;
    return matchesDate && matchesSubject;
  });

  const formatDisplayDate = (dateStr: string) => formatLongDate(dateStr);

  return (
    <div className="space-y-4">
      {/* Mobile Tab Switcher */}
      <div className="lg:hidden flex items-center p-1 rounded-xl bg-[#070F24] border border-[#16274D] shadow-inner">
        <button
          onClick={() => setMobilePlannerTab('schedule')}
          className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            mobilePlannerTab === 'schedule'
              ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-[0_0_12px_rgba(37,99,235,0.5)]'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <span>📅 Schedule & Plan</span>
        </button>
        <button
          onClick={() => setMobilePlannerTab('goals')}
          className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            mobilePlannerTab === 'goals'
              ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-[0_0_12px_rgba(37,99,235,0.5)]'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <span>🎯 Goals & Stats</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 items-start">
        {/* ========================================================
            LEFT COLUMN: 8 Columns (Hero, Today's Plan, Weekly Schedule, Recommended)
            ======================================================== */}
        <div
          className={`lg:col-span-8 flex-col space-y-4 sm:space-y-5 ${
            mobilePlannerTab === 'goals' ? 'hidden lg:flex' : 'flex'
          }`}
        >
          {/* 1. Main Study Planner Hero */}
          <StudyPlannerHero
            onOpenAiPlanner={() => setIsAiPlanOpen(true)}
            onOpenCreateGoal={() => setIsCreateGoalOpen(true)}
            onManageSchedule={() => {
              showToast('Showing your active Weekly Schedule below', 'info');
            }}
            onBuildHabits={() => {
              showToast('Consistency Tip: Study at the same time each day for maximum retention! 🔥', 'info');
            }}
          />

          {/* 2. Middle Row: 2 Cards (Today's Plan + Weekly Schedule) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 items-stretch">
            <TodaysPlanCard
              tasks={todayTasks}
              displayDate={formatDisplayDate(selectedDate)}
              onToggleTask={handleToggleTask}
              onAddTask={() => {
                setTaskToEdit(null);
                setIsAddTaskOpen(true);
              }}
              onEditTask={(task) => {
                setTaskToEdit(task);
                setIsAddTaskOpen(true);
              }}
              onDeleteTask={(task) => {
                setTaskToDelete(task);
              }}
              onViewFullPlan={() => {
                showToast('Viewing full schedule for all subjects', 'info');
              }}
            />

            <WeeklyScheduleCard
              tasks={tasks}
              selectedDate={selectedDate}
              onSelectDate={(date) => setSelectedDate(date)}
              onViewCalendar={() => {
                showToast('Viewing calendar schedule for August / September', 'info');
              }}
              onSelectSession={(sub) => {
                handleSelectPopularSubject(sub);
              }}
              onAddTaskForDate={(date) => {
                setSelectedDate(date);
                setTaskToEdit(null);
                setIsAddTaskOpen(true);
              }}
            />
          </div>

          {/* 3. Bottom Row: Recommended for You */}
          <RecommendedSection
            onSelectItem={handleSelectRecommendation}
            onViewAll={() => {
              showToast('Loading full library of study quizzes & summaries...', 'info');
            }}
          />
        </div>

        {/* ========================================================
            RIGHT UTILITIES COLUMN: 4 Columns (Goals, Popular Subjects, Motivation, Streak)
            ======================================================== */}
        <div
          className={`lg:col-span-4 flex-col space-y-4 sm:space-y-5 ${
            mobilePlannerTab === 'schedule' ? 'hidden lg:flex' : 'flex'
          }`}
        >
        {/* 1. Your Study Goals */}
        <StudyGoalsCard
          goals={goals}
          onToggleGoal={handleToggleGoal}
          onCreateGoal={() => setIsCreateGoalOpen(true)}
          onViewAll={() => {
            showToast('All active study goals displayed', 'info');
          }}
        />

        {/* 2. Popular Subjects */}
        <PopularSubjectsCard
          selectedSubject={selectedSubjectFilter}
          onSelectSubject={handleSelectPopularSubject}
          onViewAll={() => {
            setSelectedSubjectFilter(null);
            showToast('Showing all subjects', 'info');
          }}
        />

        {/* 3. Motivation Card ("You can do it!") */}
        <MotivationCard
          onViewProgress={() => {
            if (onNavigateProgress) {
              onNavigateProgress();
            } else {
              showToast('My Progress is available from the navigation.', 'info');
            }
          }}
        />

        {/* 4. Study Streak Card */}
        <StudyStreakCard streakDays={streakDays} />
      </div>
    </div>

      {/* ========================================================
          MODALS
          ======================================================== */}
      {/* 1. Add / Edit Task Modal */}
      {isAddTaskOpen && (
        <AddTaskModal
          key={taskToEdit?.id ? `task-edit-${taskToEdit.id}` : `task-add-${selectedDate}`}
          isOpen={isAddTaskOpen}
          onClose={() => {
            setIsAddTaskOpen(false);
            setTaskToEdit(null);
          }}
          onAddTask={handleAddTask}
          taskToEdit={taskToEdit}
          onUpdateTask={handleUpdateTask}
          defaultDate={selectedDate}
        />
      )}

      {/* 2. Create Goal Modal */}
      {isCreateGoalOpen && (
        <CreateGoalModal
          key={`goal-create-${selectedSubjectFilter || 'default'}`}
          isOpen={isCreateGoalOpen}
          onClose={() => setIsCreateGoalOpen(false)}
          onCreateGoal={handleCreateGoal}
          defaultSubject={selectedSubjectFilter || 'Mathematics'}
        />
      )}

      {/* 3. AI Plan Generator Modal */}
      {isAiPlanOpen && (
        <AiPlanGeneratorModal
          key={`ai-plan-${selectedSubjectFilter || 'default'}`}
          isOpen={isAiPlanOpen}
          onClose={() => setIsAiPlanOpen(false)}
          onAddPlanToSchedule={handleApplyAiPlan}
          startDate={selectedDate}
          initialSubject={selectedSubjectFilter || 'Mathematics'}
        />
      )}

      {/* 4. Delete Confirmation Modal */}
      {!!taskToDelete && (
        <DeleteTaskModal
          key={`task-delete-${taskToDelete.id}`}
          isOpen={!!taskToDelete}
          onClose={() => setTaskToDelete(null)}
          onConfirm={handleConfirmDelete}
          taskTitle={taskToDelete?.topic || ''}
          taskSubject={taskToDelete?.subject || ''}
        />
      )}
    </div>
  );
};
