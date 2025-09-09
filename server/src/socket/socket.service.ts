import { Injectable } from "@nestjs/common";

@Injectable()
export class SocketService {
  // Map<userId, socketId>
  private activeUsers: Map<string, string> = new Map();

  addUser(userId: string, socketId: string) {
    this.activeUsers.set(userId, socketId);
  }

  removeUser(userId: string) {
    this.activeUsers.delete(userId);
  }

  getAUserSocketId(userId: string): string | undefined {
    return this.activeUsers.get(userId);
  }

  getUsersSocketId(userIds: string[]): string[] {
    return userIds
      .map((id) => {
        const socketId = this.activeUsers.get(id.toString());
        if (socketId) {
          return socketId;
        }
      })
      .filter((socketId): socketId is string => socketId !== undefined);
  }
}
