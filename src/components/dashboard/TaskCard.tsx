import React from 'react';
import { Calendar, Flag, Clock, MoreVertical } from 'lucide-react';
import { format } from 'date-fns';
import { Task } from '../../types';
import { PRIORITY_COLORS, STATUS_COLORS } from '../../utils/constants';
import { Button } from '../ui/Button';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onStatusChange: (task: Task, status: Task['status']) => void;
}

export function TaskCard({ task, onEdit, onDelete, onStatusChange }: TaskCardProps) {
  const [showMenu, setShowMenu] = React.useState(false);

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-medium text-gray-900 dark:text-white mb-1">
            {task.title}
          </h3>
          {task.description && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              {task.description}
            </p>
          )}
        </div>
        
        <div className="relative">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowMenu(!showMenu)}
            className="p-1"
          >
            <MoreVertical className="h-4 w-4" />
          </Button>
          
          {showMenu && (
            <div className="absolute right-0 mt-1 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 z-10">
              <div className="py-1">
                <button
                  onClick={() => {
                    onEdit(task);
                    setShowMenu(false);
                  }}
                  className="block w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Edit Task
                </button>
                <button
                  onClick={() => {
                    onDelete(task);
                    setShowMenu(false);
                  }}
                  className="block w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Delete Task
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 mb-3">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${PRIORITY_COLORS[task.priority]}`}>
          <Flag className="h-3 w-3 inline mr-1" />
          {task.priority}
        </span>
        
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[task.status]}`}>
          {task.status.replace('_', ' ')}
        </span>
      </div>

      {task.dueDate && (
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-3">
          <Calendar className="h-4 w-4 mr-1" />
          Due: {format(new Date(task.dueDate), 'MMM dd, yyyy')}
        </div>
      )}

      {task.isRecurring && (
        <div className="flex items-center text-sm text-blue-600 dark:text-blue-400 mb-3">
          <Clock className="h-4 w-4 mr-1" />
          Recurring ({task.recurringType})
        </div>
      )}

      <div className="flex gap-2">
        {task.status !== 'todo' && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => onStatusChange(task, 'todo')}
          >
            To Do
          </Button>
        )}
        {task.status !== 'in_progress' && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => onStatusChange(task, 'in_progress')}
          >
            In Progress
          </Button>
        )}
        {task.status !== 'completed' && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => onStatusChange(task, 'completed')}
          >
            Complete
          </Button>
        )}
      </div>
    </div>
  );
}