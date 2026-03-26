using fantasy_creature_adoption.Server.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace fantasy_creature_adoption.Server.Data
{
    public class AppDbContext : IdentityDbContext<ApplicationUser>
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Creature> Creatures => Set<Creature>();
        public DbSet<Adoption> Adoptions => Set<Adoption>();

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<Adoption>()
                .HasOne(a => a.Creature)
                .WithMany()
                .HasForeignKey(a => a.CreatureId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<Adoption>()
                .HasOne(a => a.User)
                .WithMany()
                .HasForeignKey(a => a.UserId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}