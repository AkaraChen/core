import { Exclude, Transform, Type } from 'class-transformer';
import {
  ArrayUnique,
  IsBoolean,
  IsEmail,
  IsIP,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  ValidateNested,
} from 'class-validator';
import { JSONSchema } from 'class-validator-jsonschema';

import { ApiProperty } from '@nestjs/swagger';

import { IsAllowedUrl } from '@shared/utils/validator/isAllowedUrl';

import {
  JSONSchemaArrayField,
  JSONSchemaHalfGirdPlainField,
  JSONSchemaNumberField,
  JSONSchemaPasswordField,
  JSONSchemaPlainField,
  JSONSchemaToggleField,
  halfFieldOption,
} from './configs.jsonschema.decorator';

@JSONSchema({ title: 'SEO 优化' })
export class SeoDto {
  @IsString({ message: '标题必须是字符串' })
  @IsNotEmpty({ message: '不能为空!!' })
  @IsOptional()
  @JSONSchemaPlainField('网站标题')
  title: string;

  @IsString({ message: '描述信息必须是字符串' })
  @IsNotEmpty({ message: '不能为空!!' })
  @IsOptional()
  @JSONSchemaPlainField('网站描述')
  description: string;

  @IsString({ message: '关键字必须为一个数组', each: true })
  @IsOptional()
  @JSONSchemaArrayField('关键字')
  keywords?: string[];
}

@JSONSchema({ title: '网站设置' })
export class UrlDto {
  @IsAllowedUrl()
  @IsOptional()
  @ApiProperty({ example: 'http://127.0.0.1:2323' })
  @JSONSchemaHalfGirdPlainField('前端地址')
  webUrl: string;

  @IsAllowedUrl()
  @IsOptional()
  @ApiProperty({ example: 'http://127.0.0.1:9528' })
  @JSONSchemaHalfGirdPlainField('管理后台地址')
  adminUrl: string;

  @IsAllowedUrl()
  @IsOptional()
  @ApiProperty({ example: 'http://127.0.0.1:2333' })
  @JSONSchemaHalfGirdPlainField('API 地址')
  serverUrl: string;

  @IsAllowedUrl()
  @IsOptional()
  @ApiProperty({ example: 'http://127.0.0.1:8080' })
  @JSONSchemaHalfGirdPlainField('Gateway 地址')
  wsUrl: string;
}

class MailOption {
  @IsInt()
  @Transform(({ value: val }) => parseInt(val))
  @IsOptional()
  @JSONSchemaNumberField('发件邮箱端口', halfFieldOption)
  port: number;
  @IsUrl({ require_protocol: false })
  @IsOptional()
  @JSONSchemaHalfGirdPlainField('发件邮箱 host')
  host: string;
}
@JSONSchema({ title: '邮件通知设置' })
export class MailOptionsDto {
  @IsBoolean()
  @IsOptional()
  @JSONSchemaToggleField('开启邮箱提醒')
  enable: boolean;
  @IsEmail()
  @IsOptional()
  @JSONSchemaHalfGirdPlainField('发件邮箱地址')
  user: string;
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @Exclude({ toPlainOnly: true })
  @JSONSchemaPasswordField('发件邮箱密码', halfFieldOption)
  pass: string;

  @ValidateNested()
  @Type(() => MailOption)
  @IsOptional()
  @JSONSchema({ 'ui:option': { connect: true } })
  options?: MailOption;
}

@JSONSchema({ title: '评论设置' })
export class CommentOptionsDto {
  @IsBoolean()
  @IsOptional()
  @JSONSchemaToggleField('反垃圾评论')
  antiSpam: boolean;

  @IsString({ each: true })
  @IsOptional()
  @ArrayUnique()
  @JSONSchemaArrayField('自定义屏蔽关键词')
  spamKeywords?: string[];

  @IsIP(undefined, { each: true })
  @ArrayUnique()
  @IsOptional()
  @JSONSchemaArrayField('自定义屏蔽 IP')
  blockIps?: string[];

  @IsOptional()
  @IsBoolean()
  @JSONSchemaToggleField('禁止非中文评论')
  disableNoChinese?: boolean;

  @IsOptional()
  @IsBoolean()
  @JSONSchemaToggleField('只展示已读评论')
  commentShouldAudit?: boolean;

  @IsBoolean()
  @IsOptional()
  @JSONSchemaToggleField('评论公开归属地')
  recordIpLocation?: boolean;

  @IsOptional()
  @IsInt()
  @JSONSchemaNumberField('超时时间', {
    description: '获取 IP 归属地的超时时间。单位: 毫秒。如获取超时则不记录',
  })
  fetchLocationTimeout?: number;
}

@JSONSchema({ title: '备份' })
export class BackupOptionsDto {
  @IsBoolean()
  @IsOptional()
  @JSONSchemaToggleField('开启自动备份', {
    description: '填写以下 COS 信息, 将同时上传备份到 COS',
  })
  enable: boolean;

  @IsString()
  @IsOptional()
  @JSONSchemaHalfGirdPlainField('SecretId')
  secretId?: string;

  @IsOptional()
  @IsString()
  @Exclude({ toPlainOnly: true })
  @JSONSchemaPasswordField('SecretKey', halfFieldOption)
  secretKey?: string;

  @IsOptional()
  @IsString()
  @JSONSchemaHalfGirdPlainField('Bucket')
  bucket?: string;

  @IsString()
  @IsOptional()
  @JSONSchemaHalfGirdPlainField('地域 Region')
  region: string;
}

@JSONSchema({ title: '后台附加设置' })
export class AdminExtraDto {
  @IsBoolean()
  @IsOptional()
  @JSONSchemaToggleField('开启后台管理反代', {
    description: '是否可以通过 API 访问后台',
  })
  /**
   * 是否开启后台反代访问
   */
  enableAdminProxy?: boolean;

  @IsString()
  @IsOptional()
  @JSONSchemaPlainField('登录页面背景')
  background?: string;

  @IsString()
  @IsOptional()
  @JSONSchemaPlainField('中后台标题')
  title?: string;

  @IsString()
  @IsOptional()
  @Exclude({ toPlainOnly: true })
  @JSONSchemaPasswordField('高德查询 API Key', { description: '日记地点定位' })
  gaodemapKey?: string;
}

@JSONSchema({ title: '友链设定' })
export class FriendLinkOptionsDto {
  @IsBoolean()
  @IsOptional()
  @JSONSchemaToggleField('允许申请友链')
  allowApply: boolean;
}
