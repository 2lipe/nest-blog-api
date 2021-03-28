import { classToPlain, Exclude } from 'class-transformer';
import { IsEmail } from 'class-validator';
import * as bcrypt from 'bcryptjs';
import { BeforeInsert, Column, Entity, JoinTable, ManyToMany } from 'typeorm';
import { AbstractEntity } from './abstract-entity';

@Entity('users')
export class UserEntity extends AbstractEntity {
  @Column({ unique: true })
  @IsEmail()
  email: string;

  @Column({ unique: true })
  username: string;

  @Column({ default: '' })
  bio: string;

  @Column({ default: null, nullable: true })
  image: string | null;

  @Column()
  @Exclude()
  password: string;

  @ManyToMany(() => UserEntity, (user) => user.following)
  @JoinTable()
  followers: UserEntity[];

  @ManyToMany(() => UserEntity, (user) => user.followers)
  following: UserEntity[];

  @BeforeInsert()
  async hashPassword() {
    const salt = 10;

    this.password = await bcrypt.hash(this.password, salt);
  }

  async comparePassword(password: string) {
    return await bcrypt.compare(password, this.password);
  }

  toJSON() {
    return classToPlain(this);
  }

  toProfile(user: UserEntity) {
    const following = this.followers.includes(user);

    const profile: any = this.toJSON();

    delete profile.followers;

    return { ...profile, following };
  }
}
