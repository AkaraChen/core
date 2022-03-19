import { Module } from "@nestjs/common"; // 引入模块
import { ConfigModule, ConfigService } from '@nestjs/config'; // 引入配置文件
import { APP_FILTER, APP_GUARD } from "@nestjs/core"; // 引入守卫
import { JwtModule } from "@nestjs/jwt"; // 引入jwt模块
import { PassportModule } from "@nestjs/passport"; // 引入passport模块
import { TypeOrmModule } from "@nestjs/typeorm"; // 引入typeorm模块
import { AllExceptionFilter } from "./common/filters/all-exception.filter"; // 引入过滤器
import { RolesGuard } from "./common/guards/roles.guard"; // 引入守卫
import { FriendsModule } from "./modules/friends/friends.module"; // 引入好友模块
import { MailController } from "./modules/mail/mail.controller"; // 引入邮件模块
import { MailService } from "./modules/mail/mail.service"; // 引入邮件模块
import { UsersController } from "./modules/users/users.controller"; // 引入用户模块
import { AppController } from "./app.controller"; // 引入控制器
import { AppService } from "./app.service"; // 引入服务
import configs from "./configs"; // 引入配置文件
import { AuthModule } from "./modules/auth/auth.module"; // 引入认证模块
import { AuthService } from "./modules/auth/auth.service"; // 引入认证模块
import { jwtConstants } from "./modules/auth/constants"; // 引入认证模块
import { JwtStrategy } from "./modules/auth/jwt.strategy"; // 引入认证模块
import { LocalStrategy } from "./modules/auth/local.strategy"; // 引入认证模块
import { CategoriesController } from "./modules/categories/categories.controller"; // 引入分类模块
import { CategoriesModule } from "./modules/categories/categories.module"; // 引入分类模块
import { CategoriesService } from "./modules/categories/categories.service"; // 引入分类模块
import { CommentsController } from "./modules/comments/comments.controller"; // 引入评论模块
import { CommentsModule } from "./modules/comments/comments.module"; // 引入评论模块
import { CommentsService } from "./modules/comments/comments.service"; // 引入评论模块
import { FriendsController } from "./modules/friends/friends.controller"; // 引入好友模块
import { FriendsService } from "./modules/friends/friends.service"; // 引入好友模块
import { MailModule } from "./modules/mail/mail.module"; // 引入邮件模块
import { PagesController } from "./modules/pages/pages.controller"; // 引入页面模块
import { PagesModule } from "./modules/pages/pages.module"; // 引入页面模块
import { PagesService } from "./modules/pages/pages.service"; // 引入页面模块
import { PostsController } from "./modules/posts/posts.controller"; // 引入文章模块
import { PostsModule } from "./modules/posts/posts.module"; // 引入文章模块
import { PostsService } from "./modules/posts/posts.service"; // 引入文章模块
import { UsersModule } from "./modules/users/users.module"; // 引入用户模块
import { UsersService } from "./modules/users/users.service"; // 引入用户模块
import configuration from "./utils/getDataConfig.util"; // 引入配置文件
import { ProjectsModule } from "modules/projects/projects.module"; // 引入项目模块
import { ProjectsController } from "modules/projects/projects.controller"; // 引入项目模块
import { ProjectsService } from "modules/projects/projects.service"; // 引入项目模块
import { GHttp } from "../helper/helper.http.service";
import { ScheduleModule } from '@nestjs/schedule'

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: "jwt" }), // passport module
    JwtModule.register({ // jwt module
      secret: jwtConstants.secret, // secret key
      signOptions: { expiresIn: configs.expiration + "s" }, // expiration time
    }),
    ConfigModule.forRoot({ // config module
      isGlobal: true,
      load: [configuration], // load config file
    }),
    TypeOrmModule.forRootAsync({ // typeorm module
      imports: [ConfigModule], // import config module
      useFactory: (configService: ConfigService) => { // use config service
        return { // return config
          type: "mysql", // database type
          host: configService.get("DB_HOST"),
          port: configService.get("DB_PORT"),
          username: configService.get("DB_USERNAME"),
          password: configService.get("DB_PASSWORD"),
          database: configService.get("DB_DATABASE"),
          entities: [__dirname + "/**/*.entity{.ts,.js}"],
          synchronize: true,  // synchronize database
        };
      },
      inject: [ConfigService], // inject config service
    }),
    ScheduleModule.forRoot(),
    UsersModule,
    AuthModule,
    PostsModule,
    PagesModule,
    CommentsModule,
    CategoriesModule,
    MailModule,
    FriendsModule,
    ProjectsModule
  ],
  controllers: [
    AppController,
    UsersController,
    PagesController,
    PostsController,
    CommentsController,
    CategoriesController,
    MailController,
    FriendsController,
    ProjectsController
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    {
      provide: APP_FILTER,
      useClass: AllExceptionFilter,
    },
    AppService,
    UsersService,
    AuthService,
    LocalStrategy,
    JwtStrategy,
    PostsService,
    PagesService,
    CommentsService,
    CategoriesService,
    MailService,
    FriendsService,
    ProjectsService,
    GHttp
  ],
})
export class AppModule {}
