import { Team_Members } from 'src/team_members/entities/team_members.entity';
import { Teams } from 'src/teams/entities/teams.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToOne } from 'typeorm';

export enum UserRole {
    ADMIN = 'admin',
    OWNER = 'owner',
    EMPLOYEE = 'employee',
}

@Entity('users')

export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 100, unique: true })
    username: string;

    @Column({ length: 255 })
    password: string;

    @Column({ length: 10, unique: true })
    phone: string;

    @Column({ type: 'enum', enum: UserRole, default: UserRole.EMPLOYEE })
    role: UserRole;

    @Column({ default: false }) 
    is_verified: boolean;

    @Column({ nullable: true, default: null })
    avatar: string;

    @Column({ nullable: true, default: null })
    refresh_token: string;

    @OneToOne(() => Teams, (team) => team.owner)
    ownedTeam: Teams;

    @OneToOne(() => Team_Members, (member) => member.user)
    teamMember: Team_Members;

    @CreateDateColumn({ type: 'timestamp' })
    created_at: Date;

    @CreateDateColumn({ type: 'timestamp' })
    updated_at: Date;

}