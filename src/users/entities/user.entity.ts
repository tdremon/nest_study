import { Column, Entity, PrimaryColumn } from 'typeorm';

// Table name
@Entity('User')
export class UserEntity {
    // PRIMARY KEY
    @PrimaryColumn()
    id: string;

    @Column({ length: 30 })
    name: string;

    @Column({ length: 60 })
    email: string;

    @Column({ length: 30 })
    password: string;

    @Column({ length: 60 })
    signupVerifyToken: string;
    
}
