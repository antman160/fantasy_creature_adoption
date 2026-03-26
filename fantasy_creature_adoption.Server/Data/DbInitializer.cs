using fantasy_creature_adoption.Server.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace fantasy_creature_adoption.Server.Data
{
    public static class DbInitializer
    {
        public static async Task SeedAsync(WebApplication app)
        {
            using var scope = app.Services.CreateScope();

            var services = scope.ServiceProvider;
            var context = services.GetRequiredService<AppDbContext>();
            var userManager = services.GetRequiredService<UserManager<ApplicationUser>>();
            var roleManager = services.GetRequiredService<RoleManager<IdentityRole>>();
            var configuration = services.GetRequiredService<IConfiguration>();

            // Make sure the database is updated to the latest migration
            await context.Database.MigrateAsync();

            // Seed roles
            string[] roles = { "Admin", "User" };

            foreach (var role in roles)
            {
                if (!await roleManager.RoleExistsAsync(role))
                {
                    await roleManager.CreateAsync(new IdentityRole(role));
                }
            }

            // Seed admin account
            var adminEmail = configuration["SeedAdmin:Email"] ?? "admin@fantasycreatures.com";
            var adminPassword = configuration["SeedAdmin:Password"] ?? "Admin123!";
            var adminFullName = configuration["SeedAdmin:FullName"] ?? "System Admin";

            var adminUser = await userManager.FindByEmailAsync(adminEmail);

            if (adminUser == null)
            {
                adminUser = new ApplicationUser
                {
                    UserName = adminEmail,
                    Email = adminEmail,
                    FullName = adminFullName,
                    EmailConfirmed = true
                };

                var createAdminResult = await userManager.CreateAsync(adminUser, adminPassword);

                if (!createAdminResult.Succeeded)
                {
                    var errors = string.Join(", ", createAdminResult.Errors.Select(e => e.Description));
                    throw new Exception($"Failed to create seed admin user: {errors}");
                }
            }

            if (!await userManager.IsInRoleAsync(adminUser, "Admin"))
            {
                await userManager.AddToRoleAsync(adminUser, "Admin");
            }

            if (!await userManager.IsInRoleAsync(adminUser, "User"))
            {
                await userManager.AddToRoleAsync(adminUser, "User");
            }

            // Seed sample creatures
            if (!await context.Creatures.AnyAsync())
            {
                var creatures = new List<Creature>
                {
                    new Creature
                    {
                        Name = "Emberclaw",
                        Species = "Dragon",
                        Description = "A young dragon with warm scales and a confident personality.",
                        Habitat = "Large house with secure backyard",
                        Temperament = "High-energy",
                        Diet = "Carnivore",
                        ImageUrl = "/images/emberclaw.jpg",
                        IsAdopted = false
                    },
                    new Creature
                    {
                        Name = "Moonglow",
                        Species = "Unicorn",
                        Description = "A gentle unicorn that enjoys quiet routines and peaceful surroundings.",
                        Habitat = "Small ranch or spacious yard",
                        Temperament = "Calm",
                        Diet = "Herbivore",
                        ImageUrl = "/images/moonglow.jpg",
                        IsAdopted = false
                    },
                    new Creature
                    {
                        Name = "Thistlehop",
                        Species = "Jackalope",
                        Description = "A fast and alert jackalope that bonds slowly but becomes very loyal.",
                        Habitat = "Apartment or home with indoor play space",
                        Temperament = "Shy",
                        Diet = "Herbivore",
                        ImageUrl = "/images/thistlehop.jpg",
                        IsAdopted = false
                    },
                    new Creature
                    {
                        Name = "Mossback",
                        Species = "Griffin",
                        Description = "A sturdy griffin with protective instincts and a strong attachment to its owner.",
                        Habitat = "Large property or rural home",
                        Temperament = "Prey drive",
                        Diet = "Carnivore",
                        ImageUrl = "/images/mossback.jpg",
                        IsAdopted = false
                    },
                    new Creature
                    {
                        Name = "Ashwing",
                        Species = "Phoenix",
                        Description = "A bright and striking phoenix that prefers its own space but stays close to trusted people.",
                        Habitat = "House with aviary or enclosed outdoor space",
                        Temperament = "Independent",
                        Diet = "Omnivore",
                        ImageUrl = "/images/ashwing.jpg",
                        IsAdopted = false
                    },
                    new Creature
                    {
                        Name = "Velvetshade",
                        Species = "Mothman",
                        Description = "A mysterious nocturnal companion that is intelligent, watchful, and sensitive to noise.",
                        Habitat = "Quiet home with dark resting areas",
                        Temperament = "Shy",
                        Diet = "Omnivore",
                        ImageUrl = "/images/velvetshade.jpg",
                        IsAdopted = false
                    }
                };

                await context.Creatures.AddRangeAsync(creatures);
                await context.SaveChangesAsync();
            }
        }
    }
}