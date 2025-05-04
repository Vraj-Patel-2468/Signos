import { prisma } from "../utils/prisma";

// Helper function to find user ID by email
const findUserIdByEmail = async (email: string) => {
    const user = await prisma.user.findUnique({
        where: { email },
    });
    return user?.id;
};

export const createTask = async ({
    title,
    description,
    status,
    priority,
    dueDate,
    assignedTo, // Email of the user
    projectId,
    userId,
    remarks,
    rating,
}: {
    title: string;
    description: string;
    status: string;
    priority: string;
    dueDate: Date | string;
    assignedTo: string; // Email instead of user ID
    projectId: number;
    userId: number;
    remarks?: string;
    rating?: number;
}) => {
    try {
        if (!title || !description || !status || !priority || !projectId || !userId) {
            return { error: "Missing required fields", status: 400 };
        }

        // Find the user ID by email
        const assignedUserId = await findUserIdByEmail(assignedTo);
        if (!assignedUserId) {
            return { error: "Assigned user not found", status: 404 };
        }

        const project = await prisma.project.findUnique({
            where: { id: projectId },
            include: { team: { include: { users: true } } },
        });

        if (!project) return { error: "Project not found", status: 404 };
        if (!project.team || !project.team.users) return { error: "Project team data is missing", status: 500 };

        const user = project.team.users.find((u) => u.userId === userId);
        if (!user) return { error: "You are not a member of this project's team", status: 403 };

        if (user.roleInTeam !== "Leader") return { error: "Only team leaders can create tasks", status: 403 };

        // Validate assigned user
        const assignedUser = project.team.users.find((u) => u.userId === assignedUserId);
        if (!assignedUser) return { error: "Assigned user is not a member of this project's team", status: 400 };

        // Validate dueDate
        const parsedDueDate = new Date(dueDate);
        if (isNaN(parsedDueDate.getTime())) return { error: "Invalid due date", status: 400 };

        const newTask = await prisma.task.create({
            data: {
                title,
                description,
                status,
                priority,
                dueDate: parsedDueDate,
                assignedTo: assignedUserId, // Use the found user ID
                projectId,
                remarks,
                rating,
            },
        });

        return newTask;
    } catch (error) {
        console.error("Task creation error:", error);
        return { error: "Failed to create task", status: 500 };
    }
};

export const getTaskDetails = async (taskId: number) => {
    try {
        if (!taskId) return { error: "Task ID is required", status: 400 };

        const task = await prisma.task.findUnique({
            where: { id: taskId },
            include: {
                project: true,
                dependencies: { include: { dependsOn: true } },
                dependents: { include: { task: true } },
            },
        });

        if (!task) return { error: "Task not found", status: 404 };

        // Format dependencies for easier display
        const formattedDependencies = task.dependencies.map((dep) => ({
            id: dep.id,
            dependsOnTaskId: dep.dependsOnTaskId,
            dependsOnTaskTitle: dep.dependsOn.title,
        }));

        const formattedDependents = task.dependents.map((dep) => ({
            id: dep.id,
            taskId: dep.taskId,
            taskTitle: dep.task.title,
        }));

        return {
            ...task,
            dependencies: formattedDependencies,
            dependents: formattedDependents,
        };
    } catch (error) {
        console.error("Error fetching task details:", error);
        return { error: "Failed to fetch task details", status: 500 };
    }
};


export const updateTask = async ({
  taskId,
  title,
  description,
  status,
  priority,
  dueDate,
  assignedTo,
  userId,
  remarks,
  rating,
}: {
  taskId: number;
  title?: string;
  description?: string;
  status?: string;
  priority?: string;
  dueDate?: Date | string;
  assignedTo?: number;
  userId: number;
  remarks?: string;
  rating?: number;
}) => {
  try {
      if (!taskId || !userId) return { error: "Task ID and user ID are required", status: 400 };

      const task = await prisma.task.findUnique({
          where: { id: taskId },
          include: {
              project: { include: { team: { include: { users: true } } } },
          },
      });

      if (!task) return { error: "Task not found", status: 404 };

      const isMember = task.project.team.users.some((u) => u.userId === userId);
      if (!isMember) return { error: "You are not a member of this project's team", status: 403 };

      // Validate assigned user if changing assignment
      if (assignedTo) {
          const assignedUser = task.project.team.users.find((u) => u.userId === assignedTo);
          if (!assignedUser) return { error: "Assigned user is not a member of this project's team", status: 400 };
      }

      // Validate dueDate if provided
      const parsedDueDate = dueDate ? new Date(dueDate) : undefined;
      if (parsedDueDate && isNaN(parsedDueDate.getTime())) return { error: "Invalid due date", status: 400 };

      const updatedTask = await prisma.task.update({
          where: { id: taskId },
          data: { title, description, status, priority, dueDate: parsedDueDate, assignedTo, remarks, rating },
      });

      return updatedTask;
  } catch (error) {
      console.error("Task update error:", error);
      return { error: "Failed to update task", status: 500 };
  }
};


export const deleteTask = async (taskId: number, userId: number) => {
    try {
        if (!taskId || !userId) return { error: "Task ID and user ID are required", status: 400 };

        const task = await prisma.task.findUnique({
            where: { id: taskId },
            include: { project: { include: { team: { include: { users: true } } } } },
        });

        if (!task) return { error: "Task not found", status: 404 };

        const isMember = task.project.team.users.some((u) => u.userId === userId);
        if (!isMember) return { error: "You are not a member of this project's team", status: 403 };

        await prisma.task.delete({ where: { id: taskId } });

        return { message: "Task deleted successfully" };
    } catch (error) {
        console.error("Task deletion error:", error);
        return { error: "Failed to delete task", status: 500 };
    }
};

export const addTaskDependency = async (taskId: number, dependsOnTaskId: number) => {
    try {
        if (!taskId || !dependsOnTaskId) return { error: "Task IDs are required", status: 400 };

        const [task, dependsOnTask] = await Promise.all([
            prisma.task.findUnique({ where: { id: taskId } }),
            prisma.task.findUnique({ where: { id: dependsOnTaskId } }),
        ]);

        if (!task || !dependsOnTask) return { error: "One or both tasks not found", status: 404 };

        const dependency = await prisma.taskDependency.create({
            data: { taskId, dependsOnTaskId },
        });

        return dependency;
    } catch (error) {
        console.error("Error adding task dependency:", error);
        return { error: "Failed to add task dependency", status: 500 };
    }
};

export const removeTaskDependency = async (taskId: number, dependencyId: number) => {
    try {
        if (!taskId || !dependencyId) return { error: "Task ID and dependency ID are required", status: 400 };

        const dependency = await prisma.taskDependency.findUnique({ where: { id: dependencyId } });
        if (!dependency) return { error: "Task dependency not found", status: 404 };

        await prisma.taskDependency.delete({ where: { id: dependencyId } });

        return { message: "Task dependency removed successfully" };
    } catch (error) {
        console.error("Error removing task dependency:", error);
        return { error: "Failed to remove task dependency", status: 500 };
    }
};