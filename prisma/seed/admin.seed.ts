import { bcryptPasswordHash } from "@/lib/bcrypt";
import type { PrismaClient } from "@prisma/client";

export async function seedAdmin(prisma: PrismaClient) {
	const password = await bcryptPasswordHash("abc123#");

	const admin = await prisma.user.create({
		data: {
			email: "omeraktay159@gmail.com",
			hashedPassword: password,
		},
	});

	console.log("Admin created: ", admin);

	return admin;
}
