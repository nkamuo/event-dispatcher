
type StampIdentity = (string);

type StampConstructor = {
    identity: StampIdentity;
    new(...args: any[]): Stamp;
}

export class Stamp{

    // public id: string;

    static{
        // this.id = 'stamp';
    }

}

export class Envelope
{
    /**
     * @var array<string, list<StampInterface>>
     */
    private stamps: {[i: string]: Stamp[]} = {};
    private messageName: string;
    private message: object;

    /**
     * @param Stamp[] stamps
     */
    public  constructor(message:object, stamps:Stamp[] = [], name?: string)
    {
        this.messageName = name;
        this.message = message;

        for (const stamp of stamps) {
            const identity = (<StampConstructor>stamp.constructor).identity;

            if(!(identity in this.stamps))
                this.stamps[identity] = [];
                
            this.stamps[(stamp.constructor.name)].push(stamp);
        }
    }

    /**
     * Makes sure the message is in an Envelope and adds the given stamps.
     *
     * @param object|Envelope  message
     * @param StampInterface[] stamps
     */
    public static  wrap(message: object,stamps:Stamp[] = [], name?: string): Envelope
    {
        const envelope = (message instanceof Envelope) ? message : new Envelope(message,[],name);

        return envelope.with(...stamps);
    }

    /**
     * @return static A new Envelope instance with additional stamp
     */
    public  with(...stamps: Stamp[]): self
    {
        const cloned = clone(this);

        foreach (stamps as stamp) {
            cloned.stamps[\get_class(stamp)][] = stamp;
        }

        return cloned;
    }

    /**
     * @return static A new Envelope instance without any stamps of the given class
     */
    public  withoutAll(string stampFqcn): self
    {
        cloned = clone this;

        unset(cloned.stamps[this.resolveAlias(stampFqcn)]);

        return cloned;
    }

    /**
     * Removes all stamps that implement the given type.
     */
    public  withoutStampsOfType(string type): self
    {
        cloned = clone this;
        type = this.resolveAlias(type);

        foreach (cloned.stamps as class => stamps) {
            if (class === type || is_subclass_of(class, type)) {
                unset(cloned.stamps[class]);
            }
        }

        return cloned;
    }

    public  last(string stampFqcn): ?StampInterface
    {
        return isset(this.stamps[stampFqcn = this.resolveAlias(stampFqcn)]) ? end(this.stamps[stampFqcn]) : null;
    }

    /**
     * @return StampInterface[]|StampInterface[][] The stamps for the specified FQCN, or all stamps by their class name
     */
    public  all(string stampFqcn = null): array
    {
        if (null !== stampFqcn) {
            return this.stamps[this.resolveAlias(stampFqcn)] ?? [];
        }

        return this.stamps;
    }

    /**
     * @return object The original message contained in the envelope
     */
    public  getMessage(): object
    {
        return this.message;
    }

    /**
     * BC to be removed in 6.0.
     */
    private  resolveAlias(string fqcn): string
    {
        static resolved;

        return resolved[fqcn] ?? (resolved[fqcn] = class_exists(fqcn) ? (new \ReflectionClass(fqcn)).getName() : fqcn);
    }
}
