import { Envelope } from "../Messege";
import { AbstractMiddleware, IMiddleware, IStack } from "./Middleware";

class StackMiddleware implements IMiddleware// implements MiddlewareInterface, StackInterface
{
    private stack: MiddlewareStack;
    private offset = 0;

    /**
     * @param iterable<mixed, MiddlewareInterface>|MiddlewareInterface|null middlewareIterator
     */
    public constructor(middlewareIterator: IMiddleware[]) {
        this.stack = new MiddlewareStack();

        if (null === middlewareIterator) {
            return;
        }

        if (middlewareIterator instanceof Array) {
            this.stack.iterator = middlewareIterator as any; // TODO: REMOVE (to any) AND RESOLVE THE ISSUE HERE
        }
        else
            if ((<any>middlewareIterator) instanceof AbstractMiddleware) {
                this.stack.stack.push(middlewareIterator);

            }
        // elseif (!It(middlewareIterator)) {
        //     throw new \TypeError(sprintf('Argument 1 passed to "%s()" must be iterable of "%s", "%s" given.', __METHOD__, MiddlewareInterface::class, get_debug_type(middlewareIterator)));
        // } 
        // else {
        //     this.stack.iterator = function*( ){
        //         yield from middlewareIterator;
        //     };
        // }
    }

    public next(): IMiddleware {
        var next: IMiddleware | null = <any>null;

        if (null === (next = this.stack.next(this.offset))) {
            return this;
        }

        ++this.offset;

        return next;
    }

    public handle(envelope: Envelope, stack: IStack): Envelope {
        return envelope;
    }

}

/**
 * @internal
 */
class MiddlewareStack {
    /** @var \Iterator<mixed, MiddlewareInterface> */
    public iterator: Generator<IMiddleware, IMiddleware, IStack> | null = null;
    public stack: IMiddleware[] = [];

    public next(offset: number): IMiddleware | null {
        if ((offset in this.stack)) {
            return this.stack[offset];
        }

        if (null == this.iterator) {
            return null;
        }

        // this.iterator.next();

        // if (!this.iterator.valid()) {
        if (!this.iterator) {
            return this.iterator = null;
        }

        const middleware = this.iterator.next();

        this.stack.push(middleware.value);

        return middleware.value;
    }
}
