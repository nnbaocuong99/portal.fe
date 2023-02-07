import { AppUser } from "models/AppUser";

import { ObjectField } from "react3l-decorators";
import nameof from "ts-nameof.macro";
import { UserNotification } from "./UserNotification";

ObjectField(AppUser)(
  UserNotification.prototype,
  nameof(UserNotification.prototype.appUser)
);

export * from "./UserNotification";
export * from "./UserNotificationFilter";
