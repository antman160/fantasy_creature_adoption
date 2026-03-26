namespace fantasy_creature_adoption.Server.Models
{
    public class Adoption
    {
        public int Id { get; set; }

        public string UserId { get; set; } = string.Empty;
        public ApplicationUser? User { get; set; }

        public int CreatureId { get; set; }
        public Creature? Creature { get; set; }

        public DateTime AdoptedAt { get; set; } = DateTime.UtcNow;
    }
}