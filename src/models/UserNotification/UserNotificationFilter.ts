import { IdFilter, StringFilter } from "react3l-advanced-filters";
import { ModelFilter } from "react3l-common";

export class UserNotificationFilter extends ModelFilter {
  public id?: IdFilter = new IdFilter();
  public senderId?: IdFilter = new IdFilter();
  public statusId?: IdFilter = new IdFilter();
  public recipientId?: IdFilter = new IdFilter();
  public unread?: boolean;
  public time?: StringFilter = new StringFilter();
  public siteId?: IdFilter = new IdFilter();
}
