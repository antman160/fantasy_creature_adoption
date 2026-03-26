namespace fantasy_creature_adoption.Server.DTOs.Adoption
{
    public class AdoptionResponseDto
    {
        public int AdoptionId { get; set; }
        public int CreatureId { get; set; }
        public string CreatureName { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public DateTime AdoptedAt { get; set; }
    }
}