import { Model } from "@tailflow/laravel-orion/lib/model";
import { OpinionType } from "./../types";
import { BelongsTo } from "@tailflow/laravel-orion/lib/drivers/default/relations/belongsTo";
import Request from "./Request";
import User from "./User";
import Category from "./Category";

export default class Opinion extends Model<OpinionType, {}, { request: Request; category: Category; user: User }> {
    public $resource(): string {
        return "opinions";
    }

    public request(): BelongsTo<Request> {
        return new BelongsTo(Request, this);
    }

    public user(): BelongsTo<User> {
        return new BelongsTo(User, this);
    }

    public supplier(): BelongsTo<User> {
        return new BelongsTo(User, this);
    }
}
