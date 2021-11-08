import { Model } from "@tailflow/laravel-orion/lib/model";
import { RequestType } from "./../types";
import { BelongsTo } from "@tailflow/laravel-orion/lib/drivers/default/relations/belongsTo";
import { HasMany } from "@tailflow/laravel-orion/lib/drivers/default/relations/hasMany";
import Service from "./Service";
import Category from "./Category";
import User from "./User";
import Media from "./Media";

export default class Request extends Model<RequestType, {}, { service: Service; category: Category; user: User; media: Media }> {
    public $resource(): string {
        return "requests";
    }

    public service(): BelongsTo<Service> {
        return new BelongsTo(Service, this);
    }

    public category(): BelongsTo<Category> {
        return new BelongsTo(Category, this);
    }

    public user(): BelongsTo<User> {
        return new BelongsTo(User, this);
    }

    public media(): HasMany<User> {
        return new HasMany(User, this);
    }
}
