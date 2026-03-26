namespace fantasy_creature_adoption.Server.DTOs.Adoption
{
    public class MyAdoptionDto
    {
        public int AdoptionId { get; set; }
        public int CreatureId { get; set; }
        public string CreatureName { get; set; } = string.Empty;
        public string Species { get; set; } = string.Empty;
        public string ImageUrl { get; set; } = string.Empty;
        public DateTime AdoptedAt { get; set; }
    }
}